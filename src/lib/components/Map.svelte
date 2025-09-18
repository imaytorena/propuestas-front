<!--suppress ALL, TypeScriptUnresolvedReference -->
<script lang="ts">
    import {onMount} from 'svelte';
    import c from '../data/zmg-colonias.json'
    import {tick} from 'svelte';

    import type {Geometry} from 'geojson';
    import type {LeafletMouseEvent, GeoJSON} from 'leaflet';

    const API_BASE: string = (import.meta as any).env?.VITE_API_BASE ?? 'http://localhost:3000'

    let error: string | null = $state(null)
    let loading: boolean = $state(false)
    let mapElement: string | HTMLElement;

    let {colonias, onColoniaClick} = $props();
    let selectedLayer: any = null;

    // Keep a reference to the map and the GeoJSON layer to update incrementally
    let map: any;
    let geoJsonLayer: any;
    let prevCount = 0;

    function getStyle(feature: any) {
        return {
            fillColor: 'var(--color-primary)',
            weight: 2,
            opacity: .15,
            // color: 'rgba(0, 128, 51, .1)',
            color: 'var(--color-primary)',
            dashArray: '3',
            fillOpacity: 0.2
        };
    }

    function highlightFeature(e: any) {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            color: 'var(--color-primary)',
            dashArray: '',
            fillOpacity: 0.5
        });
        layer.bringToFront();
    }

    function resetHighlight(e: LeafletMouseEvent, geoJson: GeoJSON<any, Geometry>) {
        if (e.target !== selectedLayer) {
            geoJson.resetStyle(e.target);
        }
    }

    // React when colonias prop grows: add only new features to the layer
    $effect.pre(() => {
        const list = $state.snapshot(colonias) ?? [];
        if (!geoJsonLayer) return;
        if (!Array.isArray(list)) return;
        if (list.length > prevCount) {
            const newItems = list.slice(prevCount);
            if (newItems.length) {
                geoJsonLayer.addData({
                    type: 'FeatureCollection',
                    features: newItems
                });
                prevCount = list.length;
            }
        }
    });

    onMount(() => {
        map = L.map(mapElement).setView([20.6597, -103.3496], 12);
        // Añadir el mapa base en escala de grises usando CartoDB
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: 'OpenStreetMap, CartoDB',
            maxZoom: 17,
            minZoom: 11
        }).addTo(map);

        // Create an empty GeoJSON layer; features will be added progressively
        geoJsonLayer = L.geoJSON([], {
            style: getStyle,
            onEachFeature: (feature, layer) => {
                // Popup con información de la colonia
                layer.bindPopup(`
                  <div class="text-primary font-bold">${feature.properties.nombre}</div>
                  <div class="text-primary text-sm">${feature.properties.municipio}</div>
                `);
                // Eventos de interacción
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: (e) => resetHighlight(e, geoJsonLayer),
                    click: (e) => {
                        if (selectedLayer) {
                            geoJsonLayer.resetStyle(selectedLayer);
                        }
                        selectedLayer = e.target;
                        highlightFeature(e);
                        map.fitBounds(e.target.getBounds());
                        onColoniaClick(feature.properties);
                    }
                });
            }
        }).addTo(map);

        // In case there are already items loaded before mount, add them
        const initial = Array.isArray($state.snapshot(colonias)) ? $state.snapshot(colonias) : [];
        if (initial.length) {
            geoJsonLayer.addData({ type: 'FeatureCollection', features: initial });
            prevCount = initial.length;
        }

        // Definir los límites aproximados de la ZMG
        const zmgBounds: number[][] = [
            [20.5200, -103.5000], // Suroeste
            [20.8000, -103.2000]  // Noreste
        ];

        // Restringir el área de visualización
        map.setMaxBounds(zmgBounds);
        map.on('drag', () => {
            return map.panInsideBounds(zmgBounds, {animate: false});
        });

        return () => {
            map.remove();
            geoJsonLayer = null;
        };
    });
</script>

<div
        bind:this={mapElement}
        id="map"
        class="w-full lg:max-w-full h-[50vh]"
>
</div>
<!-- 

  #map { 
    height: 500px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
-->
<style>
    #map {
        border-radius: 12px;
        box-shadow: 0 4px 15px -3px rgba(47, 133, 90, 0.1);
        border: 5px solid var(--color-primary);
        color: red;
    }

    :global(.leaflet-popup-content) {
        margin: 8px 12px;
        font-family: 'Delius', cursive;
        color: red;
    }

    :global(.leaflet-popup-content-wrapper) {
        border-radius: 8px;
        background: var(--color-base-200);
        color: red;
    }

    :global(.leaflet-popup-tip) {
        background: var(--color-base-200);
        color: red;
    }
</style>

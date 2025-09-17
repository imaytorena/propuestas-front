<div class=' sticky top-0 w-full z-[1001]'>
    <div class='h-1.5 w-full bg-base-200 overflow-hidden'>
      <div class='progress w-full h-full bg-primary/50 left-right'></div>
    </div>
</div>

<style>
  .progress {
  animation: progress 1s infinite linear;
  }

  .left-right {
      transform-origin: 0% 50%;
  }
  @keyframes progress {
  0% {
      transform:  translateX(0) scaleX(0);
  }
  30% {
      transform:  translateX(0) scaleX(0.5);
  }
  100% {
      transform:  translateX(100%) scaleX(0.5);
  }
}
</style>
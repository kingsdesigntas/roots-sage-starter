<header class="site-header">
  <div class="container">
    <div class="flex items-center">
      {!! get_custom_logo( )!!}
      <nav class="nav-primary">
        @if (has_nav_menu('primary_navigation'))
        {!! App\display_menu('primary_navigation') !!}
        @endif
      </nav>
      <button aria-label="open mobile menu" class="block md:hidden ml-2" x-data
      @click="$store.navigation.triggerEl = $event.currentTarget; $store.navigation.open = !$store.navigation.open;">
      <svg class="fill-current text-black dark:text-white transition duration-500" width="25" viewBox="0 0 50 40">
        <g>
          <rect width="50" height="5"></rect>
          <rect y="15" width="50" height="5"></rect>
          <rect y="30" width="50" height="5"></rect>
        </g>
      </svg>
    </button>
    </div>
  </div>
</header>

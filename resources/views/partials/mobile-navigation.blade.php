<div x-data id="mobile-navigation" class="admin-bar:top-admin fixed top-0 w-full left-0 h-full overflow-auto"
  :class="{'block active': $store.navigation.open , 'hidden':!$store.navigation.open}" x-cloak>
  <div class="mobile-navigation__container w-full h-full bg-white" aria-modal="true" tabIndex="-1"
    aria-labelledby="mobile-navigation__header" aria-describedby="mobile-navigation__body">
    <button type="button" aria-label="Close" @click="$store.navigation.open = false"
      class="mobile-navigation__close absolute outline-none focus:outline-none focus:ring flex justify-center items-center w-8 h-8 right-0 top-0 mt-2 mr-3">
      <svg viewBox="0 0 24 24" focusable="false" class="w-4 h-4" aria-hidden="true">
        <path fill="currentColor"
          d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z">
        </path>
      </svg>
    </button>
    <div class="mobile-navigation__content max-w-lg mx-auto py-8 px-8">
      <header class="mobile-navigation__header" id="mobile-navigation__header"></header>
      <div class="mobile-navigation__body" id="mobile-navigation__body">

        <nav class="nav-mobile">
          @if (has_nav_menu('primary_navigation'))
          {!! wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav', 'container'=>false]) !!}
          @endif
        </nav>

      </div>
    </div>
  </div>
</div>
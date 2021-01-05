<header class="site-header">
  <div class="container">
    <div class="flex items-center">
      {!! get_custom_logo( )!!}
      <nav class="nav-primary">
        @if (has_nav_menu('primary_navigation'))
        {!! wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav']) !!}
        @endif
      </nav>
    </div>
  </div>
</header>
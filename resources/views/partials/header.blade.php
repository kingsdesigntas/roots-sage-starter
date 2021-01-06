<header class="site-header">
  <div class="container">
    <div class="flex items-center">
      {!! get_custom_logo( )!!}
      <nav class="nav-primary">
        @if (has_nav_menu('primary_navigation'))
        {!! App\display_menu('primary_navigation') !!}
        @endif
      </nav>
    </div>
  </div>
</header>
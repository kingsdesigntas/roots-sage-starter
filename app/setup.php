<?php

namespace App;

use Roots\Sage\Assets\JsonManifest;
use Roots\Sage\Container;
use Roots\Sage\Template\Blade;
use Roots\Sage\Template\BladeProvider;

/**
 * Theme assets
 */
add_action('wp_enqueue_scripts', function () {
  wp_enqueue_style('sage/main.css', asset_path('styles/main.css'), false, null);
  wp_enqueue_script('sage/main.js', asset_path('scripts/main.js'), ['jquery'], null, true);

  if (is_single() && comments_open() && get_option('thread_comments')) {
    wp_enqueue_script('comment-reply');
  }
}, 100);

/**
 * Theme setup
 */
add_action('after_setup_theme', function () {
  /**
   * Enable features from Soil when plugin is activated
   * @link https://roots.io/plugins/soil/
   */
  add_theme_support('soil', [
    'clean-up',
    'disable-rest-api',
    'disable-asset-versioning',
    'disable-trackbacks',
    'js-to-footer',
    'nav-walker',
    'nice-search',
    'relative-urls',
  ]);

  /**
   * Enable plugins to manage the document title
   * @link https://developer.wordpress.org/reference/functions/add_theme_support/#title-tag
   */
  add_theme_support('title-tag');

  /**
   * Register navigation menus
   * @link https://developer.wordpress.org/reference/functions/register_nav_menus/
   */
  register_nav_menus([
    'primary_navigation' => __('Primary Navigation', 'sage'),
  ]);

  /**
   * Enable post thumbnails
   * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
   */
  add_theme_support('post-thumbnails');

  /**
   * Enable HTML5 markup support
   * @link https://developer.wordpress.org/reference/functions/add_theme_support/#html5
   */
  add_theme_support('html5', ['caption', 'comment-form', 'comment-list', 'gallery', 'search-form']);

  /**
   * Enable selective refresh for widgets in customizer
   * @link https://developer.wordpress.org/themes/advanced-topics/customizer-api/#theme-support-in-sidebars
   */
  add_theme_support('customize-selective-refresh-widgets');

  /**
   * Use main stylesheet for visual editor
   * @see resources/assets/styles/layouts/_tinymce.scss
   */
//   add_editor_style(asset_path('styles/main.css'));

/**
 * Add custom logo support
 */
  add_theme_support('custom-logo');

/**
 * Add image size
 */
//   add_image_size('gallery_thumb', 300, 300, true);
}, 20);

/**
 * Register sidebars
 */
add_action('widgets_init', function () {
  $config = [
    'before_widget' => '<section class="widget %1$s %2$s">',
    'after_widget' => '</section>',
    'before_title' => '<h3>',
    'after_title' => '</h3>',
  ];
  register_sidebar([
    'name' => __('Primary', 'sage'),
    'id' => 'sidebar-primary',
  ] + $config);
  register_sidebar([
    'name' => __('Footer', 'sage'),
    'id' => 'sidebar-footer',
  ] + $config);
});

/**
 * Updates the `$post` variable on each iteration of the loop.
 * Note: updated value is only available for subsequently loaded views, such as partials
 */
add_action('the_post', function ($post) {
  sage('blade')->share('post', $post);
});

/**
 * Setup Sage options
 */
add_action('after_setup_theme', function () {
  /**
   * Add JsonManifest to Sage container
   */
  sage()->singleton('sage.assets', function () {
    return new JsonManifest(config('assets.manifest'), config('assets.uri'));
  });

  /**
   * Add Blade to Sage container
   */
  sage()->singleton('sage.blade', function (Container $app) {
    $cachePath = config('view.compiled');
    if (!file_exists($cachePath)) {
      wp_mkdir_p($cachePath);
    }
    (new BladeProvider($app))->register();
    return new Blade($app['view']);
  });

  /**
   * Create @asset() Blade directive
   */
  sage('blade')->compiler()->directive('asset', function ($asset) {
    return "<?= " . __NAMESPACE__ . "\\asset_path({$asset}); ?>";
});
});

/**
* Add ACF extras
*/
add_action('acf/init', function () {

/**
* Add theme options page
*/
// Check function exists.
if (function_exists('acf_add_options_page')) {

// Register options page.
$option_page = acf_add_options_page(array(
'page_title' => __('Theme General Settings'),
'menu_title' => __('Theme Settings'),
'menu_slug' => 'theme-general-settings',
'capability' => 'edit_posts',
'redirect' => false,
'position' => 50,
));
}

/**
* Add custom blocks
*/
if (function_exists('acf_register_block_type')) {

// Register a menu block.
acf_register_block_type(array(
'name' => 'my-custom-block',
'title' => __('My Custom BLock'),
'description' => __('Display a custom block.'),
'render_callback' => __NAMESPACE__ . '\\sage_blocks_callback',
'category' => 'layout',
));

}

});

function sage_blocks_callback($block, $content = '', $is_preview = false, $post_id = 0) {
$slug = str_replace('acf/', '', $block['name']);
$block = array_merge(['className' => ''], $block);
$block['post_id'] = $post_id;
$block['is_preview'] = $is_preview;
$block['content'] = $content;
$block['slug'] = $slug;
$block['anchor'] = isset($block['anchor']) ? $block['anchor'] : '';
// Send classes as array to filter for easy manipulation.
$block['classes'] = [
$slug,
$block['className'],
$block['is_preview'] ? 'is-preview' : null,
'align' . $block['align'],
];

// Filter the block data.
$block = apply_filters("sage/blocks/$slug/data", $block);

// Join up the classes.
$block['classes'] = implode(' ', array_filter($block['classes']));

$template = '';
if ($block['name'] === 'my-custom-block') {
$template = 'blocks.custom-block';
}

echo \App\template($template, ['block' => $block]);
}
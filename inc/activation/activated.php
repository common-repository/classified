<?php

/**
 * WP Classified Activation hooks.
 *
 * @package WP_Classified_Ads
 */
namespace Wp_Classified_ads;
use WP_Roles;
/**
 * Activation class.
 */
class WP_Classified_Actions_Activation
{ // @phpcs:ignore

    /**
     * Minimum required PHP version.
     *
     * @var string
     */
    public static $min_php_version = '7.4.0';

    /**
     * Minimum required WP version.
     *
     * @var string
     */
    public static $min_wp_version = '6.1';

    /**
     * Init.
     *
     * @param bool $network_enabled Whether network enabled or not.
     */
    public static function init($network_enabled)
    {

        self::compatibility();
        self::create_pages();
        self::create_roles(); 

        self::wp_classified_check_for_plugin_activation();
        // Flush Rewrite rule.
        flush_rewrite_rules( true );
    }

    /**
     * Check for multile plugin activation.
     *
     *
     */
    public static function wp_classified_check_for_plugin_activation()
    {
        // Don't do redirects when multiple plugins are bulk activated
        if (
            (isset($_REQUEST['action']) && 'activate-selected' === $_REQUEST['action']) &&
            (isset($_POST['checked']) && count($_POST['checked']) > 1)
        ) {
            return;
        }
        add_option('wp_setup_page_redirect', wp_get_current_user()->ID);
    }

    /**
     * Check compatibility before activate.
     *
     * @since 1.0.0
     */
    public static function compatibility()
    {
        // Check for PHP Compatibility.
        global $wp_version;
        if (version_compare(PHP_VERSION, self::$min_php_version, '<')) {

            $flag = __('PHP', 'classified');

            // translators: placeholder for PHP minimum version.
            $version = sprintf(__('%s or higher', 'classified'), self::$min_php_version);
            deactivate_plugins(basename(WP_CLASSIFIED_ADS_PLUGIN_FILE));
            // translators: placeholder for PHP word & PHP minimum version.
            $message = sprintf(__('WP Classified plugin requires %1$s version %2$s to work.', 'classified'), $flag, $version);
            wp_die(
                esc_attr($message),
                esc_attr(__('Plugin Activation Error', 'classified')),
                array(
                    'response'  => 200,
                    'back_link' => true,
                )
            );
        }
    }

    /**
     * Create WP Classified Ads Pages.
     *
     * @since 1.0.0
     */
    public static function create_pages()
    {
        /**
         * Insert cart and checkout pages
         *
         * @since 1.0.0
         */
        // include_once sprintf('%sinc/admin/admin-helper.php', WP_CLASSIFIED_ADS_ABSPATH );

        // Shortcode filters.
        $account_shortcode_tag = apply_filters('wp_classifed_ads_user_account', 'WP_CLASSIFIED_ADS_USER_DASHBOARD'); // phpcs:ignore
        $account_shortcode_tag = apply_filters('wpclassified_user_account', $account_shortcode_tag);

        $pages = apply_filters(
            'wp_classified_ads_create_pages', // phpcs:ignore
            array(
                'wp-classified-dashboard' => array(
                    'name'    => _x('wp-classified-dashboard', 'Page slug', 'classified'),
                    'title'   => _x('WP Classified User Dashboard', 'Page title', 'classified'),
                    'content' => '[' . $account_shortcode_tag . ']',
                ),
            )
        );

        $pages = apply_filters('wpclassiried_create_pages', $pages);

        foreach ($pages as $key => $page) {
            self::wp_classified_create_page(esc_sql($page['name']), 'wp_classified_user_dashboard_page_id', $page['title'], $page['content']);
        }
    }
    /**
     * Create a page and store the ID in an option.
     *
     * @param mixed  $slug Slug for the new page.
     * @param string $option Option name to store the page's ID.
     * @param string $page_title (default: '') Title for the new page.
     * @param string $page_content (default: '') Content for the new page.
     * @param int    $post_parent (default: 0) Parent for the new page.
     * @return int page ID
     */
    public static function wp_classified_create_page($slug, $option = '', $page_title = '', $page_content = '', $post_parent = 0)
    {
        global $wpdb;

        $option_value = get_option($option);
        $page_object  = get_post($option_value);
        if ($option_value > 0 && ($page_object)) {
            if ('page' === $page_object->post_type && !in_array($page_object->post_status, array('pending', 'trash', 'future', 'auto-draft'), true)) {
                // Valid page is already in place.
                if (strlen($page_content) > 0) {
                    // Search for an existing page with the specified page content (typically a shortcode).
                    $valid_page_found = $wpdb->get_var($wpdb->prepare("SELECT ID FROM $wpdb->posts WHERE post_type='page' AND post_status NOT IN ( 'pending', 'trash', 'future', 'auto-draft' ) AND post_content LIKE %s LIMIT 1;", "%{$page_content}%"));
                } else {
                    // Search for an existing page with the specified page slug.
                    $valid_page_found = $wpdb->get_var($wpdb->prepare("SELECT ID FROM $wpdb->posts WHERE post_type='page' AND post_status NOT IN ( 'pending', 'trash', 'future', 'auto-draft' )  AND post_name = %s LIMIT 1;", $slug));
                }

                $valid_page_found = apply_filters('wp_classified_create_page_id', $valid_page_found, $slug, $page_content); // @phpcs:ignore
                $valid_page_found = apply_filters('wpclassified_create_page_id', $valid_page_found, $slug, $page_content);

                if ($valid_page_found) {
                    if ($option) {
                        update_option($option, $valid_page_found);
                    }
                    return $valid_page_found;
                }
            }
        }

        // Search for a matching valid trashed page.
        if (strlen($page_content) > 0) {
            // Search for an existing page with the specified page content (typically a shortcode).
            $trashed_page_found = $wpdb->get_var($wpdb->prepare("SELECT ID FROM $wpdb->posts WHERE post_type='page' AND post_status = 'trash' AND post_content LIKE %s LIMIT 1;", "%{$page_content}%"));
        } else {
            // Search for an existing page with the specified page slug.
            $trashed_page_found = $wpdb->get_var($wpdb->prepare("SELECT ID FROM $wpdb->posts WHERE post_type='page' AND post_status = 'trash' AND post_name = %s LIMIT 1;", $slug));
        }

        if ($trashed_page_found) {
            $page_id   = $trashed_page_found;
            $page_data = array(
                'ID'          => $page_id,
                'post_status' => 'publish',
            );
            wp_update_post($page_data);
        } else {
            $page_data = array(
                'post_status'    => 'publish',
                'post_type'      => 'page',
                'post_author'    => 1,
                'post_name'      => $slug,
                'post_title'     => $page_title,
                'post_content'   => $page_content,
                'comment_status' => 'closed',
            );
            $page_id   = wp_insert_post($page_data);
        }

        if ($option) {
            update_option($option, $page_id);
        }

        return $page_id;
    }
    /**
     * Create roles and capabilities.
     */
    public static function create_roles()
    {
        global $wp_roles;

        if (!class_exists('WP_Roles')) {
            return;
        }

        if (!isset($wp_roles)) {
            $wp_roles = new WP_Roles(); // @codingStandardsIgnoreLine
        }

        // Customer role.
        add_role(
            'wp-classified-customer',
            __('WP Classified Customer', 'classified' ),
            array(
                'read' => true,
            )
        );
    }
    public static function deactivate( $network_enabled ) {
        update_option( 'wp_classified_flush_permalink', false );
    }
}

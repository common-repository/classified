<?php
/**
 * Added shortcode for user dashboard
 */
namespace Wp_Classified_Ads;

 class WP_Classified_Shortcode {
    public function __construct()
    {
        add_shortcode( 'WP_CLASSIFIED_ADS_USER_DASHBOARD', array( $this, 'get_user_dashboard_shortcode' ) );
        // add_shortcode( 'wp_classified_user_account', array( $this, 'get_user_dashboard_shortcode' ) );
    }
    public function get_user_dashboard_shortcode() {
        $user   = wp_get_current_user();
        $user_data = $user->data;
        // print_r( $user);
        $user_id   = isset( $user_data->ID ) ? $user_data->ID : 0;
        return "<div id='wp-classified-ads-user-dashboard'>
                    <div id='wp-classified-ads-user-dashboard-login-logout'></div>
                    <input type='hidden' value='" . $user_id . "'/>
                </div>";
    }
 }
 new WP_Classified_Shortcode();
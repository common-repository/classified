<?php
/**
 * @since 6.1.0
 *
 * WP Travel register Clssified Ads api
 */
namespace Wp_Classified_Ads;

/**
 * use the class Wp_Classified_Ads_Api_Lists
 */
// use Wp_Classified_Ads\Wp_Travel_Classified_Ads_Api_Lists;
/**
 * @register custom route
 */
class Wp_Classified_Ads_Api_Lists_Register {
	/**
	 * @since 1.0
	 * Register all custom route
	 */
	public static function wp_register_classified_ads_api_route() {
		$all_route = Wp_Classified_Ads_Api_Lists::wp_all_classified_ads_api();
		foreach ( $all_route as  $key => $vall ) {
			register_rest_route(
				$vall['api_version'],
				$vall['route'],
				array(
					'methods'             => $vall['method'],
					'callback'            => $vall['callback_function'],
					'permission_callback' => '__return_true',
				)
			);
		}
	}
}

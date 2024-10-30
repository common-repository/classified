<?php
/**
 * Update user data
 * name space declear
 */
namespace Wp_Classified_Ads;

/**
 * use WordPress class for api
 */
use WP_REST_Request;
/**
 * create class for update user data api
 */

if ( ! class_exists( 'Wp_Classified_Ads_Update_User' ) ) {
	class Wp_Classified_Ads_Update_User {
		public static function wp_classified_ads_update_user( WP_REST_Request $wp_classified_user ) {
			header( 'Access-Control-Allow-Origin: *' );
			$request = isset( $_SERVER['REQUEST_METHOD'] ) ? $_SERVER['REQUEST_METHOD'] : '';
			if ( $request == 'POST' || $request == 'PUT' ) {
				$profile_image = isset( $_FILES['file'] ) ? $_FILES['file'] : array();
				$user_data     = $wp_classified_user->get_params();
				$user_id       = $wp_classified_user->get_param( 'id' );
				$user_obj      = new WP_Classified_User_Helper();
				$user_data     = is_string( $user_data ) ? json_decode( $user_data, true ) : $user_data;
				$response      = $user_obj->classified_update_user( $user_id, $user_data, $profile_image );
				return $response;
			} else {
				return wp_send_json_error( 'request_method_is_invalied' );
			}
		}
	}
}

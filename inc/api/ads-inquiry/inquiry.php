<?php
/**
 * Wp classified ads user inquiry
 */
namespace Wp_Classified_Ads;

/**
 * Use rest request class
 */
use WP_REST_Request;
/**
 * check class exist or not
 */
if ( ! class_exists( 'Wp_Classified_Ads_Inquiry' ) ) {
	class Wp_Classified_Ads_Inquiry {
		/**
		 * function for getting inquiry data
		 */
		public static function wp_classified_ads_inquiry( WP_REST_Request $inquiry_data ) {
			$request = isset( $_SERVER['REQUEST_METHOD'] ) ? $_SERVER['REQUEST_METHOD'] : '';
			if ( $request == 'POST' ) {
				$inquiry_fetch_data = $inquiry_data->get_params();
				$inquiry_fetch_data = is_string( $inquiry_fetch_data ) ? json_decode( $inquiry_fetch_data, true ) : $inquiry_fetch_data;
				$responce           = Wp_Classified_Ads_Helpers::send_ads_inquiry( $inquiry_fetch_data );
				return $responce;
			} else {
				return wp_send_json_error( 'request_invalied' );
			}
		}
	}
}

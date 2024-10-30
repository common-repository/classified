<?php
/**
 * Get Delete Ads
 */
namespace Wp_Classified_Ads;

/**
 * Wordpress class of WP_REST_Request is use
 */
use WP_REST_Request;
/**
 * Get Delete Ads
 *
 * @since 1.0
 */
class Wp_Travel_Classified_Ads_Delete {
	/**
	 * @since 1.0
     * @param Id
     * 
	 */
	public static function wp_travel_delete_clssified_ads_api( WP_REST_Request $classified_ads_id ) {
		$request = isset( $_SERVER['REQUEST_METHOD'] ) ? $_SERVER['REQUEST_METHOD'] : '';
		$request_server = isset( $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ) ? $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] : '';
		if ( $request == 'DELETE' || $request_server == 'DELETE' ) {
			$ads_id = $classified_ads_id->get_param( 'id' );
			$ads_data = wp_delete_post( $ads_id );
			$meta_data = delete_post_meta( $ads_id, 'wp_travel_classified_ads_info', true );
			delete_post_meta( $ads_id, 'wp_classified_ads_stock_inventory', true );
			delete_post_meta( $ads_id, 'wp_travel_classified_ads_gallery', true );
			wp_delete_object_term_relationships( $ads_id, WP_CLASSIFIED_ADS_ADS_TEXONOMY );
			if ( ! is_wp_error( $ads_data ) ) {
				return 'you_are_successfully_deleted_ads.';
			}
		}
		return 'Invalide request';
	}
	/**
	 * return term id
	 */
	public static function wp_classified_ads_get_term_id( $ads_id ) {
		$get_term = wp_get_post_terms( $ads_id , WP_CLASSIFIED_ADS_ADS_TEXONOMY );
		$term_id = array();
		foreach ( $get_term as $key => $obj ) {
			$term_id[] = $obj->term_id;
		}
		return $term_id;
	}
	/**
	 * @since 1.0
     * @param Id
	 * 
	 * ads type delete
     * 
	 */
	public static function wp_travel_delete_clssified_ads_type_api( WP_REST_Request $classified_ads_type_id ) {
		$request = $_SERVER['REQUEST_METHOD'];
		if ( $request == 'DELETE' ) {
			$ads_type_id = $classified_ads_type_id->get_param( 'id' );
			$responce = wp_delete_term( $ads_type_id, WP_CLASSIFIED_ADS_ADS_TEXONOMY );
			if ( $responce == true  ) {
				return 'You are successfully deleted ads type.';
			}
		}
	}
}

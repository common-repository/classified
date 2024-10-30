<?php
/**
 * Get single Ads create
 */
namespace Wp_Classified_Ads;

/**
 * WordPress class of WP_REST_Request is use
 */
use WP_REST_Request;
/**
 * Get single Ads create
 *
 * @since 1.0
 * @param Ads ID
 * @return List of ads
 */
class Wp_Travel_Classified_Ads_Create {
	/**
	 * @since 1.0
	 * @param ID
	 */
	public static function wp_travel_post_clssified_ads_api( WP_REST_Request $classified_ads ) {
		$url_data = $classified_ads->get_params();
		/**
		 * Verify nonce of classified ads
		 */
		// $nc = wp_create_nonce( 'wp_rest' );
		// $nonces = isset( $url_data['_nonce'] ) ? $url_data['_nonce'] : '';
		// print_r( wp_verify_nonce( $nc, 'wp_rest' ) );
		// echo 'hesldfjdlff';
		// print_r(  wp_verify_nonce($nonces, 'wp_classified_ads' ) ); die;
		// if ( $nonces != '' ) {
		// if ( ! wp_verify_nonce($nonces, 'wp_classified_ads' ) ) {
		// 	return 'Your nonce token is not match';
		// }
		// }
		$request = $_SERVER['REQUEST_METHOD'];
		if ( $request == 'POST' ) {
			$ads_data  = is_array( $url_data ) && isset( $url_data['ads_meta'] ) ? ( is_string( $url_data['ads_meta'] ) ? json_decode( $url_data['ads_meta'], true ) : $url_data['ads_meta'] ) : $url_data;
			$ads_type  = is_array( $url_data ) && isset( $url_data['ads_type'] ) ? ( is_string( $url_data['ads_type'] ) ? json_decode( $url_data['ads_type'], true ) : $url_data['ads_type'] ) : array();
			$gallery   = is_array( $url_data ) && isset( $url_data['gallery'] ) ? $url_data['gallery'] : array();
			$author    = is_array( $url_data ) && isset( $url_data['ads_author'] ) ? $url_data['ads_author'] : 0;
			$galleries = isset( $_FILES['galleries'] ) ? $_FILES['galleries'] : array();
			if ( isset( $ads_data ) ) {
				$ads_id = 0;
				if ( $author > 0 ) {
					$ads_id = wp_insert_post(
						array(
							'post_title'   => isset( $ads_data['ads_name'] ) ? $ads_data['ads_name'] : '',
							'post_content' => isset( $ads_data['description'] ) ? $ads_data['description'] : '',
							'post_author'  => $author,
							'post_status'  => 'publish',
							'post_type'    => WP_CLASSIFIED_ADS_POST_TYPE,
						)
					);
				} else {
					$ads_id = wp_insert_post(
						array(
							'post_title'   => isset( $ads_data['ads_name'] ) ? $ads_data['ads_name'] : '',
							'post_content' => isset( $ads_data['description'] ) ? $ads_data['description'] : '',
							'post_status'  => 'publish',
							'post_type'    => WP_CLASSIFIED_ADS_POST_TYPE,
						)
					);
				}
				if ( isset( $ads_type ) && $ads_id > 0 ) {
					$res = wp_set_post_terms( $ads_id, $ads_type, WP_CLASSIFIED_ADS_ADS_TEXONOMY );
				}
				if ( $ads_id > 0 ) {
					$stock_inventory = isset( $ads_data['inventory'] ) ? $ads_data['inventory'] : '';
					update_post_meta( $ads_id, 'wp_travel_classified_ads_info', $ads_data );
					update_post_meta( $ads_id, 'wp_classified_ads_stock_inventory', $stock_inventory );
					/**
					 * store image in postmeta
					 * also set thumbnail image
					 */
					if ( isset( $galleries ) && ! empty( $galleries ) && count( $galleries ) > 0 ) {
						$gallery_data = Wp_Classified_Ads_Helpers::wp_classified_upload_image( $galleries );
						// print_r( $gallery_data );
						update_post_meta( $ads_id, 'wp_travel_classified_ads_gallery', $gallery_data );
						$thumbnails = isset( $gallery_data[0] ) && isset( $gallery_data[0]['id'] ) ? $gallery_data[0]['id'] : '';
						update_post_meta( $ads_id, '_thumbnail_id', $thumbnails );
					} else {
						update_post_meta( $ads_id, 'wp_travel_classified_ads_gallery', $gallery );
						if ( isset( $ads_data['gallery'] ) ) {
							$gallerys = $ads_data['gallery'];
							update_post_meta( $ads_id, '_thumbnail_id', $gallerys );
						} else {
							$new_thumnail = isset( $gallery[0] ) && isset( $gallery[0]['id'] ) ? $gallery[0]['id'] : 0;
							update_post_meta( $ads_id, '_thumbnail_id', $new_thumnail );
						}
					}
				}
				return array( $ads_id );
			} else {
				return 'your post data is empty.';
			}
		}
	}
	/**
	 * @since 1.0
	 * @param ID
	 * create ads type
	 */
	public static function wp_travel_post_clssified_ads_type_api( WP_REST_Request $classified_ads_type ) {
		$ads_type_data = $classified_ads_type->get_params();
		/**
		 * Verify nonce of classified ads
		 */
		$nonces = isset( $ads_type_data['_nonce'] ) ? $ads_type_data['_nonce'] : '';
		if ( $nonces != '' ) {
			if ( ! wp_verify_nonce( $nonces, 'wp_classified_ads' ) ) {
				return 'Your nonce token is not match';
			}
		}
		$request = $_SERVER['REQUEST_METHOD'];
		if ( $request == 'POST' ) {
			$ads_type = isset( $ads_type_data['adsType'] ) ? $ads_type_data['adsType'] : array();
			if ( isset( $ads_type ) ) {
				$term_name = isset( $ads_type['ads_type'] ) ? $ads_type['ads_type'] : '';
				$parent    = isset( $ads_type['parent'] ) ? $ads_type['parent'] : 0;
				if ( $term_name != '' ) {
					$ads_type_id = wp_insert_term( $term_name, WP_CLASSIFIED_ADS_ADS_TEXONOMY, array( 'parent' => $parent ) );
					return $ads_type_id;
				} else {
					return 'Ads name is empty';
				}
			} else {
				return 'Pour post data is empty.';
			}
		}
	}

}

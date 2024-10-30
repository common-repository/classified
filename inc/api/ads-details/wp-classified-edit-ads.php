<?php
/**
 * Get single Ads
 */
namespace Wp_Classified_Ads;

/**
 * WordPress class of WP_REST_Request is use
 */
use WP_REST_Request;
/**
 * Get single Ads
 *
 * @since 1.0
 */
class Wp_Travel_Classified_Single_Ads_Edit {
	/**
	 * @since 1.0
	 * @param ID
	 */
	public static function wp_travel_update_clssified_ads_api( WP_REST_Request $classified_ads_id ) {
		$ads_data = $classified_ads_id->get_params();

		/**
		 * Verify nonce of classified ads
		 */
		// $nc = wp_create_nonce( 'wp_rest' );
		// $nonces = isset( $ads_data['_nonce'] ) ? $ads_data['_nonce'] : '';
		// print_r( wp_verify_nonce( $nc, 'wp_rest' ) );
		// echo 'hesldfjdlff';
		// print_r(  wp_verify_nonce($nonces, 'wp_classified_ads' ) ); die;
		// if ( $nonces != '' ) {
		// 	if ( ! wp_verify_nonce( $nonces, 'wp_classified_ads' ) ) {
		// 		return 'Your nonce token did not match';
		// 	}
		// }

		$request = $_SERVER['REQUEST_METHOD'];
		if ( $request == 'POST' || $request == 'PUT' ) {
			$ads_id = $classified_ads_id->get_param( 'id' );
			if ( isset( $ads_data ) ) {
				$ads_type      = isset( $ads_data['ads_type'] ) ? ( is_string( $ads_data['ads_type'] ) ? json_decode( $ads_data['ads_type'], true ) : $ads_data['ads_type'] ) : array();
				$ads_post_meta = isset( $ads_data['ads_meta'] ) ? ( is_string( $ads_data['ads_meta'] ) ? json_decode( $ads_data['ads_meta'], true ) : $ads_data['ads_meta'] ) : array();
				$gallery       = isset( $ads_data['gallery'] ) ? ( is_string( $ads_data['gallery'] ) ? json_decode( $ads_data['gallery'], true ) : $ads_data['gallery'] ) : array();
				$galleries     = isset( $_FILES['galleries'] ) ? $_FILES['galleries'] : array();

				$ads_update = wp_update_post(
					array(
						'ID'           => $ads_id,
						'post_title'   => isset( $ads_post_meta['ads_name'] ) ? $ads_post_meta['ads_name'] : '',
						'post_content' => isset( $ads_post_meta['description'] ) ? $ads_post_meta['description'] : '',
						'post_status'  => 'publish',
						'post_type'    => WP_CLASSIFIED_ADS_POST_TYPE,
					)
				);
				// if ( ! empty( $ads_type ) ) {
					wp_set_post_terms( $ads_id, $ads_type, WP_CLASSIFIED_ADS_ADS_TEXONOMY );
				// }
				if ( isset( $galleries ) && ! empty( $galleries ) && count( $galleries ) > 0 ) {
					$old_gallery  = get_post_meta( $ads_id, 'wp_travel_classified_ads_gallery', true );
					$gallery_data = Wp_Classified_Ads_Helpers::wp_classified_upload_image( $galleries );
					$new_gallery  = array( ...$old_gallery, ...$gallery_data );
					update_post_meta( $ads_id, 'wp_travel_classified_ads_gallery', $new_gallery );
					$thumbnail_img = Wp_Classified_Ads_Helpers::wp_classified_ads_get_thumbnail_id( $ads_id );
					if ( $thumbnail_img <= 0 ) {
						$thumbnails = isset( $gallery_data[0] ) && isset( $new_gallery[0]['id'] ) ? $gallery_data[0]['id'] : '';
						update_post_meta( $ads_id, '_thumbnail_id', $thumbnails );
					}
				} else {
					update_post_meta( $ads_id, 'wp_travel_classified_ads_gallery', $gallery );
				}
				if ( isset( $ads_post_meta ) ) {
					$ads_meta     = $ads_post_meta;
					$new_ads_meta = array();
					foreach ( $ads_meta as $key => $value ) {
						if ( $key !== 'Condition' ) {
							$new_ads_meta[ $key ] = $value;
						}
					}
					$stock_inventory = isset( $ads_meta['inventory'] ) ? $ads_meta['inventory'] : '';
					update_post_meta( $ads_id, 'wp_travel_classified_ads_info', $new_ads_meta );
					update_post_meta( $ads_id, 'wp_classified_ads_stock_inventory', $stock_inventory );
					if ( isset( $ads_meta['gallery'] ) ) {
						$gallerys = $ads_meta['gallery'];
						if ( empty( $galleries ) ) {
							update_post_meta( $ads_id, '_thumbnail_id', $gallerys );
						}
					}
				}
				return $ads_update;
			}
		}
		return 'posting_ads_id_and_data_invalide';
	}
	/**
	 * @since 1.0
	 * @param ID
	 * ads type edit
	 */
	public static function wp_travel_update_clssified_ads_type_api( WP_REST_Request $classified_ads_type_id ) {
		$all_data = $classified_ads_type_id->get_params();
		/**
		 * Verify nonce of classified ads
		 */
		$nonces = isset( $all_data['_nonce'] ) ? $all_data['_nonce'] : '';
		if ( $nonces != '' ) {
			if ( ! wp_verify_nonce( $nonces, 'wp_classified_ads' ) ) {
				return 'Your nonce token did not match';
			}
		}
		$request = $_SERVER['REQUEST_METHOD'];
		if ( $request == 'POST' || $request == 'PUT' ) {
			$ads_type_id = $classified_ads_type_id->get_param( 'id' );
			$ads_type    = isset( $all_data['adsType'] ) ? $all_data['adsType'] : array();
			if ( isset( $ads_type ) && isset( $ads_type_id ) && $ads_type_id > 0 ) {
				$term_name = isset( $ads_type['ads_type'] ) ? $ads_type['ads_type'] : '';
				$parent    = isset( $ads_type['parent'] ) ? $ads_type['parent'] : 0;
				$responce  = wp_update_term(
					$ads_type_id,
					WP_CLASSIFIED_ADS_ADS_TEXONOMY,
					array(
						'name'   => $term_name,
						'parent' => $parent,
					)
				);
				return $responce;
			} else {
				return 'Ads type id is empty';
			}
		}
	}
}

<?php
// die;
/**
 * Use to remove image through user while edit post
 */
namespace Wp_Classified_Ads;

use WP_REST_Request;
/**
 * class check
 */
if ( ! class_exists( 'Wp_Classified_Ads_Image' ) ) {
	class Wp_Classified_Ads_Image {
		/**
		 * function create for remove image
		 *
		 * @param image id and ads id
		 */
		public static function wp_classified_ads_image_delete( WP_REST_Request $ads_image_id ) {
			// die('danch');
			$request        = isset( $_SERVER['REQUEST_METHOD'] ) ? $_SERVER['REQUEST_METHOD'] : '';
			$request_server = isset( $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ) ? $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] : '';
			if ( $request == 'DELETE' || $request_server == 'DELETE' ) {
				$image_info = $ads_image_id->get_params();
				$image_ids  = isset( $image_info['img_id'] ) ? $image_info['img_id'] : 0;
				$ads_id     = isset( $image_info['ads_id'] ) ? $image_info['ads_id'] : 0;
				if ( $image_ids > 0 && $ads_id > 0 ) {
					$ads_gallery     = get_post_meta( $ads_id, 'wp_travel_classified_ads_gallery', true );
					$new_ads_gallery = array();
					foreach ( $ads_gallery as $key => $value ) {
						if ( $image_ids != $value['id'] ) {
							$new_ads_gallery[] = $value;
						}
					}
					update_post_meta( $ads_id, 'wp_travel_classified_ads_gallery', $new_ads_gallery );
					$thumbnail_image_id = Wp_Classified_Ads_Helpers::wp_classified_ads_get_thumbnail_id( $ads_id );
					if ( $thumbnail_image_id == $image_ids ) {
						if ( ! empty( $new_ads_gallery ) && count( $new_ads_gallery ) > 0 ) {
							update_post_meta( $ads_id, '_thumbnail_id', $new_ads_gallery[0]['id'] );
						} else {
							update_post_meta( $ads_id, '_thumbnail_id', '' );
						}
					}
					wp_delete_attachment( $image_ids );
					return wp_send_json_success( 'deleted_sucess' );
				} else {
					return wp_send_json_success( 'image_and_ads_id_not_found' );
				}
			}
		}
	}
}

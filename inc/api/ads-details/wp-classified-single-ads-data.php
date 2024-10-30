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
 * @param Ads ID
 * @return List of ads
 */
class Wp_Travel_Classified_Ads_Single_Ads_Get {
	/**
	 * @since 1.0
	 * @param ID
	 */
	public static function wp_travel_get_single_classified_ads_api( WP_REST_Request $classified_ads_id ) {
		$url_data = $classified_ads_id->get_params();
		$url_data = is_string( $url_data ) ? json_decode( $url_data, true ) : $url_data;
		$nonces   = isset( $url_data['_nonce'] ) ? $url_data['_nonce'] : '';
		/**
		 * nonce verify
		 */
		if ( ! wp_verify_nonce( $nonces, 'wp_classified_ads' ) ) {
			return 'Sorry nonce token not verify';
		}

		// if ( $verify == false ) {
		// return 'Sorry nonce token not verify';
		// }
			// die('dancha');
		$request = $_SERVER['REQUEST_METHOD'];
		if ( $request == 'GET' ) {
			$ads_id           = $classified_ads_id->get_param( 'id' );
			$meta_data        = get_post_meta( $ads_id, 'wp_travel_classified_ads_info', true );
			$meta_data        = is_string( $meta_data ) ? json_decode( $meta_data, true ) : $meta_data;
			$terms            = get_the_terms( $ads_id, WP_CLASSIFIED_ADS_ADS_TEXONOMY );
			$ads_type_id      = array();
			$ads_type_details = array();
			if ( is_array( $terms ) ) {
				foreach ( $terms as $key => $value ) {
					$ads_type_id[]      = $value->term_id;
					$ads_type_details[] = array(
						'type_id'        => $value->term_id,
						'type_name'      => $value->name,
						'type_slug'      => $value->slug,
						'type_ads_count' => $value->count,
						'parent'         => $value->parent,
					);
				}
			}
			$ads_post_data              = get_post( $ads_id );
			$user_id                    = isset( $ads_post_data->post_author ) ? $ads_post_data->post_author : 0;
			$author_info                = Wp_Classified_Ads_Helpers::wp_classified_post_author( $user_id );
			$meta_data['author_info']   = $author_info;
			$thumnail_id                = get_post_meta( $ads_id, '_thumbnail_id', true );
			$meta_data['gallery']       = $thumnail_id;
			$meta_data['ads_id']        = $ads_id;
			$ads_post_data->author_info = $author_info;
			$single_classified_ads      = array(
				'ads_post'         => $ads_post_data,
				'ads_meta'         => $meta_data,
				'ads_type_details' => $ads_type_details,
				'gallery'          => get_post_meta( $ads_id, 'wp_travel_classified_ads_gallery', true ),
				'rating_comment'   => array(
					'average_ratting' => Wp_Classified_Ads_Helpers::wp_classified_ads_rating_count( $ads_id ),
					'rating_details'  => Wp_Classified_Ads_Helpers::wp_classifeid_ads_get_ratting_detatil( $ads_id ),
				),
				// 'current_ads_type'	=>	$ads_type,
			);
			return $single_classified_ads;
		}
	}
	/**
	 * @since 1.0
	 * @param ID
	 */
	public static function wp_travel_get_single_classified_ads_type_api( WP_REST_Request $classified_ads_type_id ) {

		$url_data = $classified_ads_type_id->get_params();
		$url_data = is_string( $url_data ) ? json_decode( $url_data, true ) : $url_data;
		$nonces   = isset( $url_data['_nonce'] ) ? $url_data['_nonce'] : '';
		/**
		 * nonce verify
		 */
		if ( ! wp_verify_nonce( $nonces, 'wp_classified_ads' ) ) {
			return 'Sorry nonce token not verify';
		}

		$request = $_SERVER['REQUEST_METHOD'];
		if ( $request == 'GET' ) {
			$ads_type_id = $classified_ads_type_id->get_param( 'id' );
			$ads_type    = get_term( $ads_type_id, WP_CLASSIFIED_ADS_ADS_TEXONOMY );
			return $ads_type;
		}
	}
}

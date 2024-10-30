<?php
/**
 * Get All Ads
 */
namespace Wp_Classified_Ads;

use WP_Query;
/**
 * WordPress class of WP_REST_Request is use
 */
use WP_REST_Request;
/**
 * Get All Ads
 *
 * @since 1.0
 * @return List of ads
 */
class Wp_Classified_All_Ads_Get {
	/**
	 *
	 * @since 1.0
	 * Get all ads
	 */
	public static function wp_get_classified_ads_api( WP_REST_Request $classified_ads ) {
		$url_data = $classified_ads->get_params();
		$url_data = is_string( $url_data ) ? json_decode( $url_data, true ) : $url_data;
		$nonces	  = isset( $url_data['_nonce'] ) ? $url_data['_nonce'] : ''; 
		/**
		 * nonce verify
		 */
		if ( ! wp_verify_nonce( $nonces, 'wp_classified_ads' ) ) {
			return 'Sorry nonce token not verify';
		}
		
		$request = $_SERVER['REQUEST_METHOD'];
		if ( $request == 'GET' ) {
			$request_page_number = isset( $url_data['page'] ) ? $url_data['page'] : 0;
			$page_number = (int) $request_page_number; 
			if ( $page_number > 0 ) {
				$args = array(
					'post_type' => WP_CLASSIFIED_ADS_POST_TYPE,
					'posts_per_page'	=> apply_filters( 'wp_classified_ads_ads_per_page_show', 20 ),
					// 'offset'	=> $page_number,
					'paged' => $page_number
				);
			} else {
				$args = array(
					'post_type' => WP_CLASSIFIED_ADS_POST_TYPE,
					'posts_per_page'   => -1,
				);
			}

			$ads_data = new WP_Query( $args );
			$index    = 0;
			$ads_list = array();
			while ( $ads_data->have_posts() ) {
				$ads_data->the_post();
				$ads_id        = get_the_ID();
				$meta_data     = get_post_meta( $ads_id );
				$thumbnail_id  = get_post_meta( $ads_id, '_thumbnail_id', true );
				$thumbnail_url = wp_get_attachment_url( $thumbnail_id );
				$ads_type_data = maybe_unserialize( get_the_terms( $ads_id, WP_CLASSIFIED_ADS_ADS_TEXONOMY ) );
				$ads_type      = array();
				if ( is_array( $ads_type_data ) ) {
					foreach ( $ads_type_data as $key => $value ) {
						$ads_type[] = array(
							'type_id'        => $value->term_id,
							'type_name'      => $value->name,
							'type_slug'      => $value->slug,
							'type_ads_count' => $value->count,
							'parent'         => $value->parent,
						);
					}
				}
				$ads_list[ $index ] = array(
					'ads_post'       => get_post(),
					'ads_meta'       => unserialize( implode( $meta_data['wp_travel_classified_ads_info'] ) ),
					'ads_type'       => $ads_type,
					'gallery'        => get_post_meta( $ads_id, 'wp_travel_classified_ads_gallery', true ),
					'featured_image' => $thumbnail_url,
					'rating_comment' => array(
						'average_ratting' => Wp_Classified_Ads_Helpers::wp_classified_ads_rating_count( $ads_id ),
						'rating_details'  => Wp_Classified_Ads_Helpers::wp_classifeid_ads_get_ratting_detatil( $ads_id ),
					),
					"total_ads_count" => wp_count_posts(WP_CLASSIFIED_ADS_POST_TYPE)->publish,
					// 'current_ads_type'	=>	$ads_type,
				);
				$index++;
			}
			return $ads_list;
		}
	}
	/**
	 *
	 * @since 1.0
	 * Get all ads type
	 */
	public static function wp_travel_get_classified_ads_type_api( WP_REST_Request $classified_ads_type ) {
		$url_data = $classified_ads_type->get_params();
		$url_data = is_string( $url_data ) ? json_decode( $url_data, true ) : $url_data;
		$nonces	  = isset( $url_data['_nonce'] ) ? $url_data['_nonce'] : ''; 
		/**
		 * nonce verify
		 */
		if ( ! wp_verify_nonce( $nonces, 'wp_classified_ads' ) ) {
			return 'Sorry nonce token not verify';
		}

		$request = $_SERVER['REQUEST_METHOD'];
		if ( $request == 'GET' ) {
			$ads_type = get_terms(
				array(
					'taxonomy'   => WP_CLASSIFIED_ADS_ADS_TEXONOMY,
					'hide_empty' => false,
				)
			);
			return $ads_type;
		}
	}
}

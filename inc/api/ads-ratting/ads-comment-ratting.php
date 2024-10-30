<?php
/**
 * wp classified ads rattings and comment
 */
namespace Wp_Classified_Ads;

/**
 * @uses WP_REST_Request
 */
use WP_REST_Request;
/**
 * check class available or not
 */
if ( ! class_exists( 'Wp_Classified_Ads_Comment_Ratting' ) ) {
	class Wp_Classified_Ads_Comment_Ratting {
		/**
		 * accept api post request for ratting and comment
		 *
		 * @param json from api
		 * return comment id and comment data
		 */
		public static function wp_classified_ads_comment_rattings( WP_REST_Request $wp_classifed_ads_commnet ) {
			$request = isset( $_SERVER['REQUEST_METHOD'] ) ? $_SERVER['REQUEST_METHOD'] : '';
			if ( $request == 'POST' ) {
				$comment_data = $wp_classifed_ads_commnet->get_params();
				$comment_data = is_string( $comment_data ) ? json_decode( $comment_data, true ) : $comment_data;
				$responce     = Wp_Classified_Ads_Helpers::wp_classified_ads_ratting_comment( $comment_data );
				return $responce;
			}
		}
	}
}

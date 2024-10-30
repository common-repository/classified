<?php
/**
 * use of trip and update data for helping
 */
namespace Wp_Classified_Ads;

/**
 * helper class check exist or not
 */
if ( ! class_exists( 'Wp_Classified_Ads\Wp_Classified_Ads_Helpers' ) ) {
	class Wp_Classified_Ads_Helpers {
		/**
		 * use to check thumbnail image set or not
		 *
		 * @param ads id
		 * @return thumbnail image id
		 */
		public static function wp_classified_ads_get_thumbnail_id( $ads_id ) {
			$thumbail = get_post_meta( $ads_id, '_thumbnail_id', true );
			if ( ! empty( $thumbail ) && $thumbail > 0 ) {
				return $thumbail;
			} else {
				return 0;
			}
		}
		/**
		 * Upload image from frontend
		 */
		public static function wp_classified_upload_image( $images, $ads_id = 0 ) {
			if ( ! empty( $images ) ) {
				// $images

				$gallery_data = array();
				foreach ( $images['name'] as $key => $value ) {
					if ( ! function_exists( 'wp_handle_upload' ) ) {
						require ABSPATH . 'wp-admin/includes/file.php';
					}
					$upload_overrides = array( 'test_form' => false );
					$uploadedfile     = array(
						'name'     => isset( $images['name'] ) && isset( $images['name'][ $key ] ) ? $images['name'][ $key ] : '',
						'type'     => isset( $images['type'] ) && isset( $images['type'][ $key ] ) ? $images['type'][ $key ] : '',
						'tmp_name' => isset( $images['tmp_name'] ) && isset( $images['tmp_name'][ $key ] ) ? $images['tmp_name'][ $key ] : '',
						'error'    => isset( $images['error'] ) && isset( $images['error'][ $key ] ) ? $images['error'][ $key ] : 0,
						'size'     => isset( $images['size'] ) && isset( $images['size'][ $key ] ) ? $images['size'][ $key ] : 0,
					);
					// print_r($uploadedfile);
					$upload = wp_handle_upload( $uploadedfile, $upload_overrides );
					if ( ! is_wp_error( $upload ) ) {
						$attachment_id = wp_insert_attachment(
							array(
								'guid'           => isset( $upload['url'] ) ? $upload['url'] : '',
								'post_mime_type' => isset( $upload['type'] ) ? $upload['type'] : '',
								'post_title'     => basename( $upload['file'] ),
								'post_content'   => '',
								'post_status'    => 'inherit',
							),
							$upload['file']
						);
						if ( ! is_wp_error( $attachment_id ) && $attachment_id > 0 ) {
							$image_url      = wp_get_attachment_image_url( $attachment_id );
							$gallery_data[] = array(
								'id'  => $attachment_id,
								'url' => $image_url,
							);
						}
					}
				}
				return $gallery_data;
			}
		}
		/**
		 * insert comment and rattting
		 */
		public static function wp_classified_ads_ratting_comment( $request ) {
			// $nonce      = isset( )
			$comment_data = isset( $request['rating_comment'] ) ? $request['rating_comment'] : '';
			$comment_data = is_string( $comment_data ) ? json_decode( $comment_data, true ) : $comment_data;
			if ( ! empty( $comment_data ) ) {
				$authour_id          = isset( $request['author_id'] ) ? $request['author_id'] : 0;
				$author_data         = get_user_by( 'id', $authour_id );
				$ads_id              = isset( $request['ads_id'] ) ? $request['ads_id'] : 0;
				$comment_title       = isset( $comment_data['comment_title'] ) ? $comment_data['comment_title'] : '';
				$comment_description = isset( $comment_data['comment_description'] ) ? $comment_data['comment_description'] : '';
				$ratings             = isset( $comment_data['ratings'] ) ? $comment_data['ratings'] : '';
				$parent_id           = isset( $request['comment_id'] ) ? $request['comment_id'] : 0;
				if ( $parent_id > 0 ) {
					$comment_id = wp_insert_comment(
						array(
							'comment_author'       => isset( $author_data->display_name ) ? $author_data->display_name : '',
							'comment_author_email' => isset( $author_data->user_email ) ? $author_data->user_email : '',
							'comment_author_url'   => isset( $author_data->user_url ) ? $author_data->user_url : '',
							'comment_approved'     => 1,
							'comment_content'      => $comment_title,
							'comment_post_ID'      => $ads_id,
							'comment_meta'         => array(
								'_wp_classified_rattings' => $ratings,
								'wp_classified_ads_comment_description' => $comment_description,
							),
							'user_id'              => $authour_id,
							'comment_parent'       => $parent_id,
						)
					);
				} else {
					$comment_id = wp_insert_comment(
						array(
							'comment_author'       => isset( $author_data->display_name ) ? $author_data->display_name : '',
							'comment_author_email' => isset( $author_data->user_email ) ? $author_data->user_email : '',
							'comment_author_url'   => isset( $author_data->user_url ) ? $author_data->user_url : '',
							'comment_approved'     => 1,
							'comment_content'      => $comment_title,
							'comment_post_ID'      => $ads_id,
							'comment_meta'         => array(
								'_wp_classified_rattings' => $ratings,
								'wp_classified_ads_comment_description' => $comment_description,
							),
							'user_id'              => $authour_id,
						)
					);
				}

				if ( ! is_wp_error( $comment_id ) ) {
					$previous_ratings = get_post_meta( $ads_id, '_classified_ads_ratings', true );
					$previous_ratings = ! empty( $previous_ratings ) ? $previous_ratings : array();
					// $new_ratings = array(...$previous_ratings, $ratings => 1);
					$previous_ratings[] = array(
						$ratings => 1,
					);
					update_post_meta( $ads_id, '_classified_ads_ratings', $previous_ratings );
					$user_response = array(
						'comment_id'     => $comment_id,
						'rating_comment' => array(
							'average_ratting' => self::wp_classified_ads_rating_count( $ads_id ),
							'rating_details'  => self::wp_classifeid_ads_get_ratting_detatil( $ads_id ),
						),
						// 'current_ads_type'	=>	$ads_type,
					);
					return wp_send_json_success( $user_response );
				} else {
					return wp_send_json_error( 'invalid_some_data' );
				}
			} else {
				return wp_send_json_error( 'commet_data_not_found' );
			}
		}
		/**
		 * get total rating count
		 */
		public static function wp_classified_ads_rating_count( $ads_id ) {
			$rating_data = get_post_meta( $ads_id, '_classified_ads_ratings', true );
			$rating_val  = 0;
			$comment_val = 0;
			if ( ! empty( $rating_data ) && count( $rating_data ) > 0 ) {
				foreach ( $rating_data as $key => $value ) {
					if ( ! empty( $value ) && count( $value ) > 0 ) {
						foreach ( $value as $rate => $comm ) {
							$rating_val  = (int) $rate + $rating_val;
							$comment_val = (int) $comm + $comment_val;
						}
					}
				}
			}
			if ( $rating_val > 0 ) {
				$average_ratings = $rating_val / $comment_val;
				return $average_ratings;
			}
			return 0;
		}
		/**
		 * get rating or commet details
		 *
		 * @param ads id
		 * @return array() of comment details
		 */
		public static function wp_classifeid_ads_get_ratting_detatil( $ads_id ) {
			$comment_data = get_comments(
				array(
					'post_id' => $ads_id,
				)
			);
			if ( ! is_wp_error( $comment_data ) ) {
				$final_data = array();
				foreach ( $comment_data as $key => $details ) {
					$comment_id     = isset( $details->comment_ID ) ? $details->comment_ID : 0;
					$comment_desc   = get_comment_meta( $comment_id, 'wp_classified_ads_comment_description', true );
					$comment_rating = get_comment_meta( $comment_id, '_wp_classified_rattings', true );
					$final_data[]   = array(
						'comment_id'          => $comment_id,
						'comment_titile'      => isset( $details->comment_content ) ? $details->comment_content : '',
						'comment_description' => $comment_desc,
						'ads_id'              => $ads_id,
						'author_id'           => $details->user_id,
						'author_name'         => $details->comment_author,
						'author_email'        => $details->comment_author_email,
						'comment_date'        => $details->comment_date,
						'comment_parent'      => $details->comment_parent,
						'approved'            => $details->comment_approved,
						'ratings'             => $comment_rating,

					);
				}

				return $final_data;
			}
			return 'comment_not_found';
		}

		/**
		 * get post author
		 */
		public static function wp_classified_post_author( $user_id ) {
			// $user_ids = isset( $_COOKIE['wp-classified-user-id'] ) ? $_COOKIE['wp-classified-user-id'] : 0;
			if ( $user_id > 0 ) {
				$user            = get_user_by( 'id', $user_id );
				$user_data       = $user->data;
				$user_id         = isset( $user_data->ID ) ? $user_data->ID : 0;
				$username        = isset( $user_data->user_login ) ? $user_data->user_login : 'this goes';
				$nicename        = isset( $user_data->user_nicename ) ? $user_data->user_nicename : '';
				$email           = isset( $user_data->user_email ) ? $user_data->user_email : '';
				$register_date   = isset( $user_data->user_registered ) ? $user_data->user_registered : '';
				$name            = isset( $user_data->display_name ) ? $user_data->display_name : '';
				$profile_image   = get_user_meta( $user_id, 'wp_classified_user_profile_image_url', true );
				$ads_favoute     = get_user_meta( $user_id, 'wp_classified_ads_added_user_favourite', true );
				$all_information = array(
					'user_id'       => $user_id,
					'username'      => $username,
					'nicename'      => $nicename,
					'email'         => $email,
					'register_date' => $register_date,
					'full_name'     => $name,
					'profile_image' => $profile_image,
				);
				return $all_information;
			}
			return array();
		}
		/**
		 * wp send ads inquiry message to the admin
		 */
		public static function send_ads_inquiry( $inquiry ) {

			$ads_id     = isset( $inquiry['ads_id'] ) ? $inquiry['ads_id'] : 0;
			$user_email = isset( $inquiry['user_email'] ) ? $inquiry['user_email'] : '';
			$user_name  = isset( $inquiry['user_name'] ) ? $inquiry['user_name'] : '';
			$message    = isset( $inquiry['message'] ) ? $inquiry['message'] : '';
			$subjects   = apply_filters( 'wp_classified_ads_inquiry_mail_subject', 'WP Classified - Product Inquiry' );
			// $ads_id  =
			// print_r( $inquiry );
			if ( $ads_id > 0 ) {
				if ( ! empty( $user_email ) ) {
					$templates    = self::inquiry_email_template( $ads_id, $user_name, $user_email, $message );
					$admin_emails = get_bloginfo( 'admin_email' );
					$headers      = self::email_headers( apply_filters( 'wp_classified_ads_inq_user_email', $user_email ) );
					// print_r( $admin_emails );
					if ( ! wp_mail( $admin_emails, $subjects, $templates, $headers ) ) {
						return wp_send_json_error( 'Something went wrong!' );
					} else {
						$inquiry_id = wp_insert_post(
							array(
								'post_title'   => 'New inquiry from ' . $user_name,
								'post_content' => $message,
								'post_status'  => 'publish',
								'post_type'    => sanitize_key( 'wpcads-prod-inquiry' ),
							)
						);

						if ( ! is_wp_error( $inquiry_id ) ) {
							update_post_meta( $inquiry_id, 'wp_classified_ads_inquiry_user_name', $user_name );
							update_post_meta( $inquiry_id, 'wp_classified_ads_inquiry_user_email', $user_email );
							update_post_meta( $inquiry_id, 'wp_classified_ads_inquiry_user_ads_id', $ads_id );
							$all_inq_data = array(
								'email_to'     => $admin_emails,
								'user_email'   => $user_email,
								'user_message' => $message,
								'subject'      => $subjects,
								'ads_id'       => $ads_id,
							);
							update_post_meta( $inquiry_id, 'wp_classified_ads_inquiry_user_ads_id', $all_inq_data );
							return wp_send_json_success(
								array(
									'ad_id'		  => $ads_id,
									'inq_id'      => $inquiry_id,
									'inq_message' => 'inquiry_email_send_success',
								)
							);
						} else {
							return wp_send_json_error( 'mail_send_but_not_insert_in_database' );
						}
					}
				} else {
					return wp_send_json_error( 'user_email_not_fined' );
				}
			} else {
				return wp_send_json_error( 'ads_id_not_found' );
			}
		}
		/**
		 * inquiry email templates
		 */
		public static function inquiry_email_template( $ads_id, $user_name, $user_email, $message ) {
			ob_start();
				?>
					<!-- <h1 style="color:red">Hi there!,</h1>
					<br>
					<p><?php echo $message ; ?> </p> -->

					<style>
						body {
							font-family: Arial, sans-serif;
							margin: 0; padding: 20px;
							background-color: #f4f4f4;
						}

						p {
							line-height: 1.6em;
						}

						table td {
							padding: 10px;
							border: 1px solid #dddddd;
						}
					</style>
					<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

					<h2 style="color: #333333;">Product Inquiry</h2>

					<p>Hi,</p>

					<p>You have received a product inquiry from a potential buyer. Below are the details:</p>

					<table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
						<tr>
							<td><strong>Inquirer Name:</strong></td>
							<td><?php echo esc_html( $user_name ) ?></td>
						</tr>
						<tr>
							<td><strong>Email:</strong></td>
							<td><?php echo esc_html( $user_email ) ?></td>
						</tr>
						<tr>
							<td><strong>Ad Listing ID:</strong></td>
							<td><?php echo esc_html( $ads_id ) ?></td>
						</tr>
						<tr>
							<td><strong>Message:</strong></td>
							<td><?php echo esc_html( $message ) ?></td>
						</tr>
					</table>

					<p>Please respond to the potential buyer at your earliest convenience. If you have any questions or need further assistance, feel free to contact us.</p>

					<p>Thank you,</p>
					<p><a href="https://wpclassified.io">WP Classified</a></p>

					</div>
				<?php
				$messa = ob_get_contents();
				ob_clean();
				return apply_filters( 'wp_classified_ads_inquiry_sms' , $messa , $user_name, $ads_id, $user_email );
		}
		/**
		 * Email Content Type headers.
		 */
		public static function email_headers( $from = '', $replyTo = '' ) {

			// To send HTML mail, the Content-type header must be set.
			$headers  = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";

			if ( $from ) :
				// Create email headers.
				$headers .= 'From: ' . $from . "\r\n";
			endif;
			if ( $replyTo ) :
				$headers .= 'Reply-To: ' . $replyTo . "\r\n" .
				'X-Mailer: PHP/' . phpversion();
			endif;

			return $headers;
		}
	}
}

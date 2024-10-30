<?php
get_header();
while( have_posts() ) {
    the_post();
}
?>
<div id="wp-classified-ads-archive-page"></div>
<?php
// get_footer();
wp_footer();
var Lm = (function(Lm, $, undefined) {
	Lm.NewsRefresh = 0;

	function NewsPage() {
		if (Lm.Settings.News != 1) {
			$("#rss_news_container").hide();
			$("#rss_news_disabled").show();
			return;
		} else {
			$("#rss_news_container").show();
			$("#rss_news_disabled").hide();
		}

		var currentTime = new Date().getTime();

		if (currentTime - Lm.NewsRefresh > 60 * 60 * 10) { //10 minutes before refreshing..
			Lm.NewsRefresh = currentTime;

			$(".rss_news").empty().addClass("data-loading").html("<img src='img/loading_indicator.gif' width='32' height='32' />");

			var settings = {
				"limit": 5,
				"layoutTemplate": "<div class='list-group'>{entries}</div>",
				"entryTemplate": "<a href='{url}' target='_blank' class='list-group-item'><h4 class='list-group-item-heading'>{title}</h4>"+
					"<p class='list-group-item-text'>{shortBodyPlain}</p></a>"
			};

			var settingsReddit = {
				"limit": 7,
				"filterLimit": 5,
				"layoutTemplate": "<div class='list-group'>{entries}</div>",
				"entryTemplate": "<a href='{url}' target='_blank' class='list-group-item'><h4 class='list-group-item-heading'>{title}</h4>"+
					"<p class='list-group-item-text'>{shortBodyReddit}</p></a>",
				"tokens": {
					"shortBodyReddit": function(entry, tokens) {
						return entry.contentSnippet.replace("&lt;!-- SC_OFF --&gt;", "").replace("&lt;!-- SC_ON --&gt;", "")
							.replace("[link]", "").replace("[comment]", "");
					}
				},
				"filter": function(entry, tokens) {
					return tokens.title.indexOf("Donations toward") == -1 && tokens.title.indexOf("Lm tipping bot has arrived") == -1
				}
			};

			$("#nxtforum_news").rss("https://nxtforum.org/index.php?type=rss;action=.xml;sa=news;", settings, Lm.NewsLoaded);
			$("#nxtcrypto_news").rss("http://info.nxtcrypto.org/feed/", settings, Lm.NewsLoaded);
			$("#reddit_news").rss("http://www.reddit.com/r/NXT/.rss", settingsReddit, Lm.NewsLoaded);
			$("#nxtcoin_blogspot_news").rss("http://nxtcoin.blogspot.com/feeds/posts/default", settings, Lm.NewsLoaded);
			$("#nextcoin_forums_news").rss("https://nextcoin.org/index.php?type=rss;action=.xml;sa=news;", settings, Lm.NewsLoaded);
			$("#nxter_news").rss("http://nxter.org/feed/", settings, Lm.NewsLoaded);
			$("#nxtcommunity_news").rss("http://www.nxtcommunity.org/rss.xml", settings, Lm.NewsLoaded);
		}
	}

	function NewsLoaded($el) {
		$el.removeClass("data-loading").find("img").remove();
	}

	$("#rss_news_enable").on("click", function() {
		Lm.UpdateSettings("news", 1);
		Lm.Pages.News();
	});


	Lm.Pages.News = NewsPage;
	Lm.NewsLoaded = NewsLoaded;
	return Lm;
}(Lm || {}, jQuery));
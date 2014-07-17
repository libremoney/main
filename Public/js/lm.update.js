var Lm = (function(Lm, $, undefined) {
	Lm.NormalVersion = {};
	Lm.BetaVersion = {};
	Lm.IsOutdated = false;


	function CheckAliasVersions() {
		if (Lm.DownloadingBlockchain) {
			$("#nrs_update_explanation span").hide();
			$("#nrs_update_explanation_blockchain_sync").show();
			return;
		}
		if (Lm.IsTestNet) {
			$("#nrs_update_explanation span").hide();
			$("#nrs_update_explanation_testnet").show();
			return;
		}

		//Get latest version nr+hash of normal version
		Lm.SendRequest("getAlias", {
			"aliasName": "lmversion"
		}, function(response) {
			if (response.aliasURI && (response = response.aliasURI.split(" "))) {
				Lm.NormalVersion.versionNr = response[0];
				Lm.NormalVersion.hash = response[1];

				if (Lm.BetaVersion.versionNr) {
					Lm.CheckForNewVersion();
				}
			}
		});

		//Get latest version nr+hash of beta version
		Lm.SendRequest("getAlias", {
			"aliasName": "lmbetaversion"
		}, function(response) {
			if (response.aliasURI && (response = response.aliasURI.split(" "))) {
				Lm.BetaVersion.versionNr = response[0];
				Lm.BetaVersion.hash = response[1];

				if (Lm.NormalVersion.versionNr) {
					Lm.CheckForNewVersion();
				}
			}
		});
	}

	function CheckForNewVersion() {
		var installVersusNormal, installVersusBeta, normalVersusBeta;

		if (Lm.NormalVersion && Lm.NormalVersion.versionNr) {
			installVersusNormal = Lm.VersionCompare(Lm.State.version, Lm.NormalVersion.versionNr);
		}
		if (Lm.BetaVersion && Lm.BetaVersion.versionNr) {
			installVersusBeta = Lm.VersionCompare(Lm.State.version, Lm.BetaVersion.versionNr);
		}

		$("#lm_update_explanation span").hide();
		$(".nrs_new_version_nr").html(Lm.NormalVersion.versionNr).show();
		$(".nrs_beta_version_nr").html(Lm.BetaVersion.versionNr).show();

		if (installVersusNormal == -1 && installVersusBeta == -1) {
			Lm.IsOutdated = true;
			$("#lm_update").html("Outdated!").show();
			$("#lm_update_explanation_new_choice").show();
		} else if (installVersusBeta == -1) {
			Lm.IsOutdated = false;
			$("#lm_update").html("New Beta").show();
			$("#lm_update_explanation_new_beta").show();
		} else if (installVersusNormal == -1) {
			Lm.IsOutdated = true;
			$("#lm_update").html("Outdated!").show();
			$("#lm_update_explanation_new_release").show();
		} else {
			Lm.IsOutdated = false;
			$("#lm_update_explanation_up_to_date").show();
		}
	}

	function VersionCompare(v1, v2) {
		if (v2 == undefined) {
			return -1;
		} else if (v1 == undefined) {
			return -1;
		}

		//https://gist.github.com/TheDistantSea/8021359 (based on)
		var v1last = v1.slice(-1);
		var v2last = v2.slice(-1);

		if (v1last == 'e') {
			v1 = v1.substring(0, v1.length - 1);
		} else {
			v1last = '';
		}

		if (v2last == 'e') {
			v2 = v2.substring(0, v2.length - 1);
		} else {
			v2last = '';
		}

		var v1parts = v1.split('.');
		var v2parts = v2.split('.');

		function isValidPart(x) {
			return /^\d+$/.test(x);
		}

		if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
			return NaN;
		}

		v1parts = v1parts.map(Number);
		v2parts = v2parts.map(Number);

		for (var i = 0; i < v1parts.length; ++i) {
			if (v2parts.length == i) {
				return 1;
			}
			if (v1parts[i] == v2parts[i]) {
				continue;
			} else if (v1parts[i] > v2parts[i]) {
				return 1;
			} else {
				return -1;
			}
		}

		if (v1parts.length != v2parts.length) {
			return -1;
		}

		if (v1last && v2last) {
			return 0;
		} else if (v1last) {
			return 1;
		} else if (v2last) {
			return -1;
		} else {
			return 0;
		}
	}

	function SupportsUpdateVerification() {
		if ((typeof File !== 'undefined') && !File.prototype.slice) {
			if (File.prototype.webkitSlice) {
				File.prototype.slice = File.prototype.webkitSlice;
			}

			if (File.prototype.mozSlice) {
				File.prototype.slice = File.prototype.mozSlice;
			}
		}

		// Check for the various File API support.
		if (!window.File || !window.FileReader || !window.FileList || !window.Blob || !File.prototype.slice || !window.Worker) {
			return false;
		}

		return true;
	}

	function VerifyClientUpdate(e) {
		e.stopPropagation();
		e.preventDefault();

		var files = null;

		if (e.originalEvent.target.files && e.originalEvent.target.files.length) {
			files = e.originalEvent.target.files;
		} else if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files.length) {
			files = e.originalEvent.dataTransfer.files;
		}

		if (!files) {
			return;
		}

		$("#lm_update_hash_progress").css("width", "0%");
		$("#lm_update_hash_progress").show();

		var worker = new Worker("js/crypto/sha256worker.js");

		worker.onmessage = function(e) {
			if (e.data.progress) {
				$("#lm_update_hash_progress").css("width", e.data.progress + "%");
			} else {
				$("#lm_update_hash_progress").hide();
				$("#lm_update_drop_zone").hide();

				if (e.data.sha256 == Lm.DownloadedVersion.hash) {
					$("#lm_update_result").html("The downloaded version has been verified, the hash is correct. You may proceed with the installation.").attr("class", " ");
				} else {
					$("#lm_update_result").html("The downloaded version hash does not compare to the specified hash in the blockchain. DO NOT PROCEED.").attr("class", "incorrect");
				}

				$("#lm_update_hash_version").html(Lm.DownloadedVersion.versionNr);
				$("#lm_update_hash_download").html(e.data.sha256);
				$("#lm_update_hash_official").html(Lm.DownloadedVersion.hash);
				$("#lm_update_hashes").show();
				$("#lm_update_result").show();

				Lm.DownloadedVersion = {};

				$("body").off("dragover.lm, drop.lm");
			}
		};

		worker.postMessage({
			file: files[0]
		});
	}

	function DownloadClientUpdate(version) {
		if (version == "release") {
			Lm.DownloadedVersion = Lm.NormalVersion;
		} else {
			Lm.DownloadedVersion = Lm.BetaVersion;
		}

		if (Lm.InApp) {
			parent.postMessage({
				"type": "update",
				"update": {
					"type": version,
					"version": Lm.DownloadedVersion.versionNr,
					"hash": Lm.DownloadedVersion.hash
				}
			}, "*");
			$("#nrs_modal").modal("hide");
		} else {
			$("#lm_update_iframe").attr("src", "https://bitbucket.org/JeanLucPicard/nxt/downloads/nxt-client-" + Lm.DownloadedVersion.versionNr + ".zip");
			$("#lm_update_explanation").hide();
			$("#lm_update_drop_zone").show();

			$("body").on("dragover.lm", function(e) {
				e.preventDefault();
				e.stopPropagation();

				if (e.originalEvent && e.originalEvent.dataTransfer) {
					e.originalEvent.dataTransfer.dropEffect = "copy";
				}
			});

			$("body").on("drop.lm", function(e) {
				Lm.VerifyClientUpdate(e);
			});

			$("#lm_update_drop_zone").on("click", function(e) {
				e.preventDefault();

				$("#lm_update_file_select").trigger("click");

			});

			$("#lm_update_file_select").on("change", function(e) {
				Lm.VerifyClientUpdate(e);
			});
		}

		return false;
	}


	Lm.CheckAliasVersions = CheckAliasVersions;
	Lm.CheckForNewVersion = CheckForNewVersion;
	Lm.VersionCompare = VersionCompare;
	Lm.SupportsUpdateVerification = SupportsUpdateVerification;
	Lm.VerifyClientUpdate = VerifyClientUpdate;
	Lm.DownloadClientUpdate = DownloadClientUpdate;
	return Lm;
}(Lm || {}, jQuery));
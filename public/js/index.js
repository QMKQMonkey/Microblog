var app = (function() {
	var app = {};
	var id;

	var bindEvent = function() {
		$().ready(function() {
			$.get("/account/current", function(responseData) {
				if(responseData.id) {
					id = responseData.id;
					$("#sidebarNickname").text(responseData.nickname);
					$("#sidebarFollowCount").text(responseData.followings);
					$("#sidebarFansCount").text(responseData.followers);
					$("#sidebarBlogCount").text(responseData.blogs);
					$(".nav-tabs a[href='#signedIn']").tab('show');
					$("#sidebarHome").click();
				} else {
					$(".nav-tabs a[href='#signIn']").tab('show');
				}
			});
		});

		$("#signInButton").on("click", function(e) {
			var userName = $("#signInUserName").val();
			var password = $("#signInPassword").val();

			$.post("/account/doSignIn", {
				userName: userName,
				password: password
			}).done(function(responseData) {
				if(!responseData.error) {
					id = responseData.id;
					console.log(responseData);
					$("#sidebarNickname").text(responseData.nickname);
					$("#sidebarFollowCount").text(responseData.followings);
					$("#sidebarFansCount").text(responseData.followers);
					$("#sidebarBlogCount").text(responseData.blogs);
					$("#signIn")[0].reset();
					$(".nav-tabs a[href='#signedIn']").tab('show');
					$("#sidebarHome").click();
				} else {
					alert(responseData.error);
				}
			});
		});

		$("#signInGoToSignUp").on("click", function(e) {
			$(".nav-tabs a[href='#signUp']").tab('show');
		});

		$("#signUpButton").on("click", function(e) {
			var userName = $("#signUpUserName").val();
			var password = $("#signUpPassword").val();
			var confirmPassword = $("#signUpConfirmPassword").val();
			var nickname = $("#signUpNickname").val();
			var realName = $("#signUpRealName").val();
			var email = $("#signUpEmail").val();
			var birthday = $("#signUpBirthday").val();
			var sex = $("#signUpSex").val();
			var phone = $("#signUpPhone").val();
			var address = $("#signUpAddress").val();

			if(password !== confirmPassword) {
				alert("Password and confirm password is inconsistent.");
				return;
			}

			$.post("/account/doSignUp", {
				userName: userName,
				password: password,
				nickname: nickname,
				realName: realName,
				email: email,
				birthday: new Date(birthday).valueOf(),
				sex: Number(sex),
				phone: phone,
				address: address
			}).done(function(responseData) {
				if(!responseData.error) {
					$(".nav-tabs a[href='#signIn']").tab('show');
					$("#signUp")[0].reset();
				} else {
					alert(responseData.error);
				}
			});
		});

		$("#signUpReturn").on("click", function(e) {
			$(".nav-tabs a[href='#signIn']").tab('show');
		});

		$("#sidebarSearchButton").on("click", function(e) {
			var key = $("#templatemo_search_box").val();
			$.get("/blog/search/?key=" + key, function(responseData) {
				var html = template("contentMicroBloggingDetailBlogsTemplate", { blogs: responseData });
				$("#contentSearchBlogs").html(html);
				$(".nav-tabs a[href='#contentSearch']").tab('show');
			});
			$.get("/blog/searchBloggers/?key=" + key, function(responseData) {
				var html = template("contentSearchPeopleTemplate", { bloggers: responseData });
				$("#contentSearchPeople").html(html);
			});
		});

		$("#sidebarHome").on("click", function(e) {
			$(".nav-tabs a[href='#contentHome']").tab('show');
		});

		$("#sidebarAt").on("click", function(e) {
			$(".nav-tabs a[href='#contentAt']").tab('show');
		});

		$("#sidebarMyComment").on("click", function(e) {
			$(".nav-tabs a[href='#contentMyComment']").tab('show');
		});

		$("#sidebarPrivateMessage").on("click", function(e) {
			$(".nav-tabs a[href='#contentPrivateMessage']").tab('show');
		});

		$("#sidebarSetting").on("click", function(e) {
			$.get("/account/current", function(responseData) {
				if(responseData.id) {
					$("#contentSettingBasicInfoNickName").val(responseData.nickname);
					$("#contentSettingBasicInfoRealName").val(responseData.realName);
					$("#contentSettingBasicInfoEmail").val(responseData.email);
					var date = new Date(responseData.birthday);
					$("#contentSettingBasicInfoBirthday").val(date.getFullYear() + "/" + 
						(date.getMonth() + 1) + "/" + date.getDate());
					$("#contentSettingBasicInfoSex").val(responseData.sex);
					$("#contentSettingBasicInfoPhone").val(responseData.phone);
					$("#contentSettingBasicInfoAddress").val(responseData.address);
					$("#contentSettingBasicInfoIntroduction").val(responseData.introduction);
					$(".nav-tabs a[href='#contentSetting']").tab('show');
				} else {
					alert("Please sign in first!");
					$(".nav-tabs a[href='#signIn']").tab('show');
				}
			});
		});

		$("#sidebarSignOut").on("click", function(e) {
			$.get("/account/doSignOut", function() {
				$(".nav-tabs a[href='#signIn']").tab('show');
			});
		});

		$("#sidebarFollow").on("click", function(e) {
			$(".nav-tabs a[href='#contentFollow']").tab('show');
		});

		$("#sidebarFans").on("click", function(e) {
			$(".nav-tabs a[href='#contentFans']").tab('show');
		});

		$("#sidebarBlog, #sidebar .navbar-icon a").on("click", function(e) {
			$.get("/blog/bloggerInfo?id=" + id, function(responseData) {
				var html = template("contentMicroBloggingDetailInfoTemplate", { blogger: responseData });
				$("#contentMicroBloggingDetailInfoContainer").html(html);
				$(".nav-tabs a[href='#contentMicroBloggingDetail']").tab('show');
			});
			$.get("/blog/blogs?id=" + id, function(responseData) {
				var html = template("contentMicroBloggingDetailBlogsTemplate", { blogs: responseData });
				$("#contentMicroBloggingDetailBlogsContainer").html(html);
			});
		});

		$("#searchButton").on("click", function(e) {
			$(".nav-tabs a[href='#contentSearch']").tab('show');
		});

		$("#content h4, #content h5, #content img").on("click", function(e) {
			$(".nav-tabs a[href='#contentMicroBloggingDetail']").tab('show');
		});

		$("#content img").on("mouseover", function(e) {
		});

		$("#contentHomePublishBlogButton").on("click", function(e) {
			var content = $("#contentHomePublishBlogContent").val();
			$.post("/blog/publish", {
				content: content
			}).done(function(responseData) {
				if(!responseData.error) {
					$("#contentHome form")[0].reset();
					$.get("/account/current", function(responseData) {
						if(responseData.id) {
							$("#sidebarNickname").text(responseData.nickname);
							$("#sidebarFollowCount").text(responseData.followings);
							$("#sidebarFansCount").text(responseData.followers);
							$("#sidebarBlogCount").text(responseData.blogs);
						}
					});
				} else {
					alert(responseData.error);
				}
			});
		});

		$("#contentSettingBasicInfoButton").on("click", function(e) {
			var nickname = $("#contentSettingBasicInfoNickName").val();
			var realName = $("#contentSettingBasicInfoRealName").val();
			var email = $("#contentSettingBasicInfoEmail").val();
			var birthday = $("#contentSettingBasicInfoBirthday").val();
			var sex = $("#contentSettingBasicInfoSex").val();
			var phone = $("#contentSettingBasicInfoPhone").val();
			var address = $("#contentSettingBasicInfoAddress").val();
			var introduction = $("#contentSettingBasicInfoIntroduction").val();

			$.post("/setting/updateInfo", {
				nickname: nickname,
				realName: realName,
				email: email,
				birthday: new Date(birthday).valueOf(),
				sex: Number(sex),
				phone: phone,
				address: address,
				introduction: introduction
			}).done(function(responseData) {
				if(responseData.error) {
					alert(responseData.error);
				}
			});
		});

		$("#contentSettingPasswordButton").on("click", function(e) {
			var originalPassword = $("#contentSettingOriginalPassword").val();
			var newPassword = $("#contentSettingNewPassword").val();
			var confirmPassword = $("#contentSettingConfirmPassword").val();

			if(newPassword !== confirmPassword) {
				alert("New password and confirm password is inconsistent.");
				return;
			}

			$.post("/setting/changePassword", {
				originalPassword: originalPassword,
				newPassword: newPassword
			}).done(function(responseData) {
				if(!responseData.error) {
					$(".nav-tabs a[href='#signIn']").tab('show');
					$("#contentSettingPassword form")[0].reset();
				} else {
					alert(responseData.error);
				}
			});
		});

		$("#contentSearchBlogs, #contentMicroBloggingDetailBlogsContainer").on('click', '[href-action]', function() {
			var target = $(this);
			var action = target.attr("href-action");
			var blogContainer = target.closest("div[id]");
			var blogId = blogContainer.attr("id");
			switch(action) {
				case "comment":
					$("#comment_" + blogId).toggleClass("hidden");
					break;

				case "forward":
					break;

				case "great":
					$.post("/blog/great", {
						id: blogId
					}).done(function(responseData) {
						if(!responseData.error) {
							alert("已赞！");
						} else {
							alert(responseData.error);
						}
					});
					break;

				case "personal":
					break;

				default:
					break;
			}
		});

		$("#messengerButton").on("click", function(e) {
			$("#messenger").addClass("hidden");
		});

		$("#whisperMiniBox").on("click", function(e) {
			$(".nav-tabs a[href='#whisperBox']").tab('show');
		});

		$("#whisperBoxMinimize").on("click", function(e) {
			$(".nav-tabs a[href='#whisperMiniBox']").tab('show');
		});

		$("#whisperBoxClose").on("click", function(e) {
			$("#whisperBox ul, #whisperBox .tab-content").empty();
			$("#whisper, #whisperBox").addClass("hidden");
		});

		$(".pull-right button").each(function(index) {
			if($(this).text() === "私信") {
				$(this).on("click", function(e) {
					$("#whisper").removeClass("hidden");
					$(".nav-tabs a[href='#whisperMiniBox']").tab('show');
				});
			}
		});
	};

	var extendTemplate = function() {
		template.helper('dateFormat', function (date, format) {

    		date = new Date(date);
    		var map = {
        		"M": date.getMonth() + 1, //月份 
        		"d": date.getDate(), //日 
        		"h": date.getHours(), //小时 
        		"m": date.getMinutes(), //分 
        		"s": date.getSeconds(), //秒 
        		"q": Math.floor((date.getMonth() + 3) / 3), //季度 
        		"S": date.getMilliseconds() //毫秒 
    		};

	    	format = format.replace(/([yMdhmsqS])+/g, function(all, t){
    	    	var v = map[t];
    	    	if(v !== undefined){
    	    		if(all.length > 1){
    	    			v = '0' + v;
    	    			v = v.substr(v.length-2);
    	    		}
    	    		return v;
    	    	}
    	    	else if(t === 'y'){
    	    		return (date.getFullYear() + '').substr(4 - all.length);
    	    	}
    	    	return all;
    		});
    		return format;
    	});
    };

	app.getId = function() {
		return id;
	};

	app.init = function() {
		bindEvent();
		extendTemplate();

		$("#signUpBirthday, #contentSettingBasicInfoBirthday").datetimepicker({
			format:'Y/m/d',
            timepicker: false
		});
	};

	return app;
})();

app.init();
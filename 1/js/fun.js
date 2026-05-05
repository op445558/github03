// 下载链接
var config = {
    android: "",
    ios: "",
    tf_app: "",
    tf_post: "",
    tf_randStr: ""
}
$(document).ready(function() {
    // 判断ios 安卓
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        document.getElementById("androidImg").style.display = 'block';
        document.getElementById("iosImg").style.display = 'none';
        document.getElementById("iosImg1").style.display = 'none';
        document.getElementById("iosTf").style.display = 'none';
    }
    if (isIOS) {
        document.getElementById("iosImg").style.display = 'block';
        document.getElementById("androidImg").style.display = 'none';
        document.getElementById("iosImg1").style.display = 'none';
        document.getElementById("iosTf").style.display = 'none';
    }
    var urls = [
        "https://bs.shun9988.com",
        "https://bs.glvroc.com",
    ];
    var prodUrl = "";
    var errorCount = 0;
    urls.forEach(function(url) {
        var img = new Image();
        img.src = url + "/svg/loading-spin.svg?_=" + new Date().getTime();
        img.onload = function() {
            if (!prodUrl) {
                prodUrl = url;

                function getURL() {
                    $.ajax({
                        url: prodUrl + "/admin/appPlatformSign/getByType",
                        type: "get",
                        async: false,
                        dataType: 'json',
                        data: {
                            webSideType: 41
                        },
                        success: function(res) {
                            initDownUrl(res)
                        },
                        error: function() {
                            setTimeout(function() {
                                getURL();
                            }, 1000)
                        }
                    })
                }
                getURL();
            }
        };
        img.onerror = function() {
            errorCount++;
            if (errorCount === 2) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = "./js/other.js?_=" + new Date().getTime();
                var tmp = document.getElementsByTagName('script')[0];
                tmp.parentNode.insertBefore(script, tmp);
            }
        };
    });
})

initDownUrl()

function initDownUrl(res = null) {
    if (!res) {
        res = {
            "code": "0",
            "msg": null,
            "data": {
                "id": 10,
                "appPlatformId": 96,
                "appPlatformName": null,
                "androidLink": "https://appdl.oldkampalass.com/download/mj-v1.7.0.apk|https://appdl.glvroc.com/download/mj-v1.7.0.apk|https://appdl.twwin.tw:9098/download/mj-v1.7.0.apk",
                "iosSign": "itms-services://?action=download-manifest&url=https://appdl.glvroc.com/download/ipa/mj_1.7.0_33_23a.plist|#|itms-services://?action=download-manifest&url=https://appdl.oldkampalass.com/download/ipa/mj_1.7.0_04_24b.plist",
                "iosTfSignRandStr": " ",
                "iosTfSign": "#"
            }
        }
    }
    let androidLink = res.data.androidLink.split("|")
    config.ios = res.data.iosSign;
    config.tf_post = res.data.iosTfSign;
    config.tf_randStr = res.data.iosTfSignRandStr;
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf(
        'Linux') > -1; //g
    var isIOS = !!u.match(
        /\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        $("#iosDown,#dfDown").hide();
        $("#androidDown,#androidDowns").hide();
        if (androidLink.length == 1) {
            $("#androidDown").attr('href', androidLink[0]).show()
        } else {
            $("#androidDowns").show()
            $("#androidDowns").click(function() {
                // 处理点击事件的代码
                $(".modal3, .modal3-mark").fadeIn();
                $("body").css({
                    overflow: "hidden"
                });
            });
            let str = "";
            androidLink.forEach((item, index) => {
                str += `
					<a href="${item}" target="_blank">
					  <span>下载地址${index+1}</span>
					</a>
				`
            })
            document.getElementById('androidDownBtn').innerHTML = str;
        }
    }
    if (isIOS) {
        $("#androidDown,#androidDowns,#dfDown").hide();
        $("#iosDown").show()
        if (config.ios && config.ios.indexOf("|") != -1) {
            if (config.ios.split("|")[0] && config.ios.split(
                    "|")[0] !== '#') {
                document.getElementById("ios-qiyesign").style
                    .display = 'flex';
                $("#ios-qiyesign").attr('href', (config.ios
                    .split("|")[0] || ''));
            }
            if (config.ios.split("|")[1] && config.ios.split(
                    "|")[1] !== '#') {
                document.getElementById("ios-supersign").style
                    .display = 'flex';
                $("#ios-supersign").attr('href', (config.ios
                    .split("|")[1] || ''));
            }
            if (config.ios.split("|")[2] && config.ios.split(
                    "|")[2] !== '#') {
                document.getElementById("ios-qiyesign2").style
                    .display = 'flex';
                $("#ios-qiyesign2").attr('href', (config.ios
                    .split("|")[2] || ''));
            }
        }
        if (config.tf_post && config.tf_post !== '#') {
            document.getElementById("ios-tf").style.display =
                'flex';
            $("#ios-test").attr('href', config.tf_post);
        }
    }
}
// 下载 ios 安卓
function download() {
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        window.open(config.android)
    }
    if (isIOS) {
        window.open(config.tf_post)
    }
}

// 打开网页版
function openFn() {
    alert('网页版即将上线，请敬期待！')
}


// 底部弹框
function showDialog() {
    document.getElementById("dialog").style.display = 'initial';
    document.getElementById("dialogBg").style.display = 'initial';
    document.getElementById("dialogCenter").style.display = 'initial';
}

function hideDialog() {
    document.getElementById("dialog").style.display = 'none';
    document.getElementById("dialogBg").style.display = 'none';
    document.getElementById("dialogCenter").style.display = 'none';
}
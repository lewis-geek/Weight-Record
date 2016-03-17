/**
 * Created by Lewis on 15/12/6.
 */

$(document).ready(function () {
    var $menu = $('.menu'),
        $femaleIcon = $('.content .fa-female'),
        $maleIcon = $('.content .fa-male'),
        $age = $('.content .age_info input'),
        $height = $('.content .height_info input'),
        $weight = $('.content .weight_info input'),
        $rangeList = $('.range_info li span'),
        $sexSection = $('.content .age_info .fa'),
        $inputOfInfo = $('.info_content input'),
        $resultBackground = $('.result_content .top_result'),
        $caretLeft = parseInt($('.fa-caret-down').css('left')),
        $loginLink = $('.header .header_banner h1'),
        $loginReg = $('.overlay_region .login_region'),
        $signupReg = $('.overlay_region .signup_region'),
        $cross = $('.overlay_region .fa-times'),
        $loginSwitch = $('.overlay_region .login_region .quick-switch'),
        $signupSwitch = $('.overlay_region .signup_region .quick-switch'),
        $sex = sexInfo(),
        timer = true,
        state = true,
        $result;


    $(window).resize(function () {
        myChart.resize()
    });

    /*
     登陆注册
     */

    $loginLink.click(function () {
        var seqMove = [{
            e: $loginReg,
            p: 'transition.expandIn',
        }, {
            e: $cross,
            p: 'transition.expandIn',
        }, {
            e: $cross,
            p: 'callout.swing',
            o: {sequenceQueue: false}
        }];
        $.Velocity.RunSequence(seqMove);
        $('.header').css('display', 'none');
        $('.buddy').css('display', 'none');
    });

    $cross.click(function () {
        $('.header').css('display', 'block');
        $('.buddy').css('display', 'block');
        var seqMove = [{
            e: $loginReg,
            p: 'fadeOut'
        }, {
            e: $signupReg,
            p: 'fadeOut',
            o: {sequenceQueue: false}
        }];
        $.Velocity.RunSequence(seqMove);
        $cross.css('display', 'none');
        var $inputList = $('.overlay_region input:not(:checkbox)');
        $inputList.removeClass('error_highlight');
        $('#signup-error-info').html('');
        $('#login-error-info').html('');
    });

    $loginSwitch.click(function () {
        var seqMove = [{
            e: $loginReg,
            p: 'fadeOut'
        }, {
            e: $signupReg,
            p: 'fadeIn'
        }];
        $.Velocity.RunSequence(seqMove);
    });

    $signupSwitch.click(function () {
        var seqMove = [{
            e: $signupReg,
            p: 'fadeOut'
        }, {
            e: $loginReg,
            p: 'fadeIn'
        }];
        $.Velocity.RunSequence(seqMove);
    });

    /*
     表单验证
     */

    $("#login_form").validate({
        focusInvalid: false,
        rules: {
            account: {
                required: true
            },
            password: {
                required: true
            }
        }, groups: {
            accandpass: "account password"
        },
        messages: {
            account: {
                required: 'Wrong username or password.'
            },
            password: {
                required: 'Wrong username or password.'
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('error_highlight');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('error_highlight');
        },
        errorContainer: '#login-error-info',
        errorPlacement: function (error, element) {
            error.appendTo("#login-error-info");
        },
        submitHandler: function () {
            var lusername = $("#login_username").val();
            var lpassword = $("#login_password").val();
            var cook = $("#check-box").is(':checked');

            $.ajax({
                url: "/BMI-Calculator/UserServlet",
                data: {method: "ajaxlogin", lusername: lusername, lpassword: lpassword, remember: cook},
                type: "POST",
                dataType: "json",
                async: false,
                cache: false,
                success: function (result) {
                    if (result) {
                        //需要跳转到主页 待定1！
                        alert("登陆成功");
                    } else {
                        alert("登陆失败,请检查您的账号/密码。欢迎注册");
                    }
                }
            });
        }
    });

    $("#signup_form").validate({
        focusInvalid: false,
        rules: {
            account: {
                required: true,
                minlength: 3
            },
            password: {
                required: true,
                maxlength: 16
            }
        }, groups: {
            accandpass: "account password"
        },
        messages: {
            account: {
                required: 'Please provide a username.'
            },
            password: {
                required: 'Please provide a password.'
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('error_highlight');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('error_highlight');
        },
        errorContainer: '#signup-error-info',
        errorPlacement: function (error, element) {
            error.appendTo("#signup-error-info");
        },
        submitHandler: function () {
            var username = $("#accout").val();
            var password = $("#password").val();

            $.ajax({
                url: "/BMI-Calculator/UserServlet",
                data: {method: "ajaxRegist", username: username, password: password},
                type: "POST",
                dataType: "json",
                async: false,
                cache: false,
                success: function (result) {
                    if (result) {
                        alert("注册成功");
                    } else {
                        alert("注册失败");
                    }
                }
            });
        }
    });

    /*
     菜单栏下拉
     */
    var $headerContent = $('nav.header_content');
    var $leftBannerMask = $('.left-banner .mask');
    var leftBanHeight = document.documentElement.clientHeight - $('.header_banner').height()

    $headerContent.css('height', leftBanHeight);
    $leftBannerMask.css('height', leftBanHeight);

    $menu.click(function () {
        if (timer) {
            $headerContent.css('transform', 'translatex(0)');
            $leftBannerMask.css('visibility', 'visible').css('background-color', 'RGBA(148, 148, 148, 0.8)');
            timer = false;
        } else if (!timer) {
            $headerContent.css('transform', 'translatex(-100%)');
            $leftBannerMask.css('visibility', 'hidden').css('background-color', 'RGBA(148, 148, 148, 0)');
            timer = true;
        }
    });

    /*
     性别选择
     */

    clickSexIcon($femaleIcon, 'fa-female-active');
    clickSexIcon($maleIcon, 'fa-male-active');

    function clickSexIcon(object, className) {
        object.click(function () {
            changeSexColor(className);
            if (object.css('opacity') == 1) {
                object.hide();
                object.fadeIn();
            }
        });
        var changeSexColor = function (className) {
            $femaleIcon.removeClass('fa-female-active');
            $maleIcon.removeClass('fa-male-active');
            object.addClass(className);
        }
    }

    /*
     限制input输入
     */

    $inputOfInfo.not(".age_info input").keypress(limitNum);
    $inputOfInfo.eq(0).keypress(function limitNum(e) {
        var k = window.event ? e.keyCode : e.which;
        if (((k >= 48) && (k <= 57)) || k == 8 || k == 0 || k == 13) {
        } else {
            if (window.event) {
                window.event.returnValue = false;
            }
            else {
                e.preventDefault(); //for firefox
            }
        }
    });

    function limitNum(e) {
        var k = window.event ? e.keyCode : e.which;
        if (((k >= 48) && (k <= 57)) || k == 8 || k == 0 || k == 46 || k == 13) {
        } else {
            if (window.event) {
                window.event.returnValue = false;
            }
            else {
                e.preventDefault(); //for firefox
            }
        }
    }

    /*
     信息处理
     sexInfo()函数返回1或2
     1代表female
     2代表male
     */

    changeAgeandSexInfo();
    result();

    function sexInfo() {
        if ($sexSection.hasClass('fa-female-active')) {
            return 1;
        } else if ($sexSection.hasClass('fa-male-active')) {
            return 2;
        }
    }

    function changeAgeandSexInfo() {
        $age.change(function () {
            changeRangeInfo();
            if (!$age.val()) {
                $rangeList.eq(0).html('&lt; 0');
                $rangeList.eq(1).html('0 - 0');
                $rangeList.eq(2).html('0 - 0');
                $rangeList.eq(3).html('0 - 0');
                $rangeList.eq(4).html('&gt; 0');
            }
        });

        $sexSection.click(function () {
            $sex = sexInfo();
            if ($age.val()) {
                changeRangeInfo();
            }
        });

        function changeRangeInfo() {
            if ($sex == 1) {
                $rangeList.eq(0).html('&lt; 18');
                $rangeList.eq(1).html('18 - 25');
                $rangeList.eq(2).html('25 - 30');
                $rangeList.eq(3).html('30 - 40');
                $rangeList.eq(4).html('&gt; 40');
            } else if ($sex == 2) {
                $rangeList.eq(0).html('&lt; 19');
                $rangeList.eq(1).html('19 - 25');
                $rangeList.eq(2).html('25 - 30');
                $rangeList.eq(3).html('30 - 40');
                $rangeList.eq(4).html('&gt; 40');
            }
        }
    }

    function result() {
        monitorChange($age);
        monitorChange($height);
        monitorChange($weight);
        $sexSection.click(function () {
            calculate();
        });

        function monitorChange($object) {
            $object.change(function () {
                calculate();
                if ($object == $height) {
                    idealWeight();
                }
            });
        }

        function calculate() {
            if ($age.val() && $height.val() && $weight.val() && sexInfo()) {
                $result = $weight.val() / (($height.val() / 100) * ($height.val() / 100));
                console.log($weight.val());
                conuntUp($result);
                changeSexIcon();
                pointPostion();
                changeColor();
            }
        }

        function conuntUp($number) {
            var options = {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
                prefix: '',
                suffix: ''
            };
            var demo = new CountUp("resultText", 0, $number, 2, 2.6, options);
            demo.start();
        }

        function changeSexIcon() {
            var $sex = sexInfo();
            if ($sex == 1) {
                $('.result_content .top_result i').removeClass().addClass('fa fa-venus')
            } else if ($sex == 2) {
                $('.result_content .top_result i').removeClass().addClass('fa fa-mars')
            }
        }

        function idealWeight() {
            var $idealWeight = 22 * ($height.val() / 100) * ($height.val() / 100);
            var $idealWeightMax = Math.round($idealWeight * 1.1);
            var $idealWeightMin = Math.round($idealWeight * 0.9);
            $rangeList.eq(5).html($idealWeightMin + ' - ' + $idealWeightMax);
        }
    }

    /*
     result_content背景动画
     */

    function changeColor() {
        var $color,
            seqChangeColor;

        if ($sex == 1 && !state) {
            if ($result < 18) {
                $color = '#6FDCFF'
            } else if (18 <= $result && $result <= 25) {
                $color = '#56A95A'
            } else if (25 < $result && $result <= 30) {
                $color = '#FBD432'
            } else if (30 < $result && $result <= 40) {
                $color = '#FF8D12'
            } else if ($result > 40) {
                $color = '#FF4746'
            }
            seqChangeColor = [{
                e: $resultBackground,
                p: {backgroundColor: $color},
                o: {duration: 2600}
            }];
        } else if ($sex == 2 && !state) {
            if ($result < 19) {
                $color = '#6FDCFF'
            } else if (19 <= $result && $result <= 25) {
                $color = '#56A95A'
            } else if (25 < $result && $result <= 30) {
                $color = '#FBD432'
            } else if (30 < $result && $result <= 40) {
                $color = '#FF8D12'
            } else if ($result > 40) {
                $color = '#FF4746'
            }
            seqChangeColor = [{
                e: $resultBackground,
                p: {backgroundColor: $color},
                o: {duration: 2600}
            }];
        }


        if ($sex == 1 && state) {

            if ($result < 18) {
                seqChangeColor = [
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#6FDCFF'},
                        o: {duration: 2600}
                    }];
            } else if (18 <= $result && $result <= 25) {
                seqChangeColor = [
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#6FDCFF'},
                        o: {duration: 1300}
                    },
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#56A95A'},
                        o: {duration: 1300}
                    }];

            } else if (25 < $result && $result <= 30) {
                seqChangeColor = [
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#6FDCFF'},
                        o: {duration: 866}
                    },
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#56A95A'},
                        o: {duration: 866}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FBD432'},
                        o: {duration: 867}
                    }];
            } else if (30 < $result && $result <= 40) {
                seqChangeColor = [
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#6FDCFF'},
                        o: {duration: 650}
                    },
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#56A95A'},
                        o: {duration: 650}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FBD432'},
                        o: {duration: 650}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FF8D12'},
                        o: {duration: 650}
                    }];
            } else if ($result > 40) {
                seqChangeColor = [
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#6FDCFF'},
                        o: {duration: 520}
                    },
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#56A95A'},
                        o: {duration: 520}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FBD432'},
                        o: {duration: 520}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FF8D12'},
                        o: {duration: 520}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FF4746'},
                        o: {duration: 520}
                    }];
            }

            state = false;


        } else if ($sex == 2 && state) {

            if ($result < 19) {
                seqChangeColor = [
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#6FDCFF'},
                        o: {duration: 2600}
                    }];
            } else if (19 <= $result && $result <= 25) {
                seqChangeColor = [
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#6FDCFF'},
                        o: {duration: 1300}
                    },
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#56A95A'},
                        o: {duration: 1300}
                    }];

            } else if (25 < $result && $result <= 30) {
                seqChangeColor = [
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#6FDCFF'},
                        o: {duration: 866}
                    },
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#56A95A'},
                        o: {duration: 866}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FBD432'},
                        o: {duration: 867}
                    }];
            } else if (30 < $result && $result <= 40) {
                seqChangeColor = [
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#6FDCFF'},
                        o: {duration: 650}
                    },
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#56A95A'},
                        o: {duration: 650}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FBD432'},
                        o: {duration: 650}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FF8D12'},
                        o: {duration: 650}
                    }];
            } else if ($result > 40) {
                seqChangeColor = [
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#6FDCFF'},
                        o: {duration: 520}
                    },
                    {
                        e: $resultBackground,
                        p: {backgroundColor: '#56A95A'},
                        o: {duration: 520}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FBD432'},
                        o: {duration: 520}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FF8D12'},
                        o: {duration: 520}
                    }, {
                        e: $resultBackground,
                        p: {backgroundColor: '#FF4746'},
                        o: {duration: 520}
                    }];

            }
            state = false;
        }

        var $h3 = $('.top_result h3'),
            $span = $('.top_result span'),
            $i = $('.top_result i');
        var seqChangeFontColor = [
            {
                e: $h3,
                p: {color: '#fff'},
            }, {
                e: $span,
                p: {color: '#fff'},
                o: {sequenceQueue: false}
            }, {
                e: $i,
                p: {color: '#fff'},
                o: {sequenceQueue: false}
            }];
        $.Velocity.RunSequence(seqChangeColor);
        $.Velocity.RunSequence(seqChangeFontColor);
    }


    function pointPostion() {
        var $width = $('.bottom_result').innerWidth();
        var $perWidth,
            $value,
            $leftValue;
        if ($sex == 1) {
            $perWidth = $width / 23;
            $value = $result - 18;
        } else if ($sex == 2) {
            $perWidth = $width / 22;
            $value = $result - 19;
        }
        $leftValue = $perWidth * $value - $caretLeft;

        if ($sex == 1 && $leftValue < 0) {
            $leftValue = $caretLeft;
        } else if ($sex == 2 && $leftValue < 0) {
            $leftValue = $caretLeft;
        } else if ($leftValue > $width) {
            $leftValue = $width + $caretLeft;
        }

        $('.fa-caret-down').show().velocity({left: $leftValue}, {duration: 2600})

    }

    /*
     eCharts
     */

    function randomData() {
        now = new Date(+now + oneDay);
        var value = Math.random() * 5;
        value += value + 70;
        return {
            name: now.toString(),
            value: [
                [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/') + ' ' + now.getHours() + ':' + now.getMinutes(), Math.round(value)
            ]
        }
    }

    var data = [];
    var now = new Date();
    var oneDay = 24 * 3600 * 1000;
    for (var i = 0; i < 20; i++) {
        data.push(randomData());
    }

    var myChart = echarts.init(document.getElementById('chart'), 'macarons');

    var option;
    option = {
        grid: {
            show: false,
            top: -7,
            left: 0,
            right: 0
        },
        tooltip: {
            trigger: 'axis',
            position: ['70%', '5%'],
            formatter: function (params) {
                params = params[0];
                var date = new Date(params.name);
                return date.getFullYear() + ' ' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + params.value[1] + 'kg';
            },
            axisPointer: {
                animation: false
            }
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                handleSize: 10,
                bottom: '15',
                width: '80%',
                left: '10%'
            },
            {
                type: 'inside',
                xAxisIndex: [0]
            }
        ],
        xAxis: {
            show: false,
            type: 'time'
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '5%'],
            scale: true,
            interval: 2,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 'auto',
                inside: true,
                rotate: 0,
                margin: 8,
                formatter: null,
                textStyle: {
                    color: '#8E9396',
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 12
                }
            },
            splitLine: {
                show: false,
                interval: 'auto'
            }
        },
        series: [{
            type: 'line',
            smooth: true,
            lineStyle: {
                normal: {
                    opacity: 0.4
                }
            },
            data: data,
            markLine: {
                symbol: 'none',
                animation: false,
                data: [
                    [
                        {
                            coord: [data[0].value[0], 75]
                        },
                        {
                            coord: [data[data.length - 1].value[0], 75]
                        }
                    ]
                ],
                lineStyle: {
                    normal: {
                        color: '#FF4444'
                    }
                }
            }
        }]
    };
    myChart.setOption(option);
});
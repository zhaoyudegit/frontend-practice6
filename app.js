const state = { data: null };
// 先声明变量，防止未定义报错
let barChart = null;
let lineChart = null;

// 加载数据，三种状态：加载中、失败、空数据
const loadData = async () => {
    $('#status').text('加载中，请稍候...').show();
    try {
        const res = await fetch('data/weather.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!data.series || data.series.length === 0) {
            $('#status').text('暂无气温数据（空数据）').show();
            return;
        }

        state.data = data;
        $('#sub-title').text(data.title + ' · ' + data.source);
        $('#status').hide();
        renderCards(data);
        // renderBarChart(data);   // 暂不调用
        // renderLineChart(data);  // 暂不调用
    } catch (err) {
        $('#status').text(`加载失败: ${err.message}`).show();
    }
};

// 渲染统计卡片
const renderCards = (data) => {
    $('#cards').empty();
    data.series.forEach(item => {
        const avg = (item.counts.reduce((a,b)=>a+b,0)/item.counts.length).toFixed(1);
        const cardHtml = `
            <div class="col-md-3 mb-3">
                <div class="card p-3">
                    <h5>${item.city}</h5>
                    <p>全年平均气温：<strong>${avg} ℃</strong></p>
                </div>
            </div>
        `;
        $('#cards').append(cardHtml);
    })
};

// 柱状图函数：写好，但loadData里面不去调用，页面不会渲染图表
const renderBarChart = (data) => {};
// 折线图函数：写好空壳占位，避免引用报错
const renderLineChart = (data) => {};

// 空的resize占位
window.addEventListener('resize',()=>{});

// jQuery交互暂不启用
// $('#cards').on('click','.card',function(){});

loadData();

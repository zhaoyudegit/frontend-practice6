const state = { data: null };
let barChart = null;
let lineChart = null;

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
        renderBarChart(data);      // ✅开启柱状图
        // renderLineChart(data);   // 折线依旧关闭
    } catch (err) {
        $('#status').text(`加载失败: ${err.message}`).show();
    }
};

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

// 补全ECharts柱状图
const renderBarChart = (data) => {
    if (!barChart) barChart = echarts.init(document.querySelector('#bar-chart'));
    const cityList = data.series.map(s=>s.city);
    const avgTempList = data.series.map(s=>{
        return (s.counts.reduce((a,b)=>a+b,0)/s.counts.length).toFixed(1);
    })
    barChart.setOption({
        title:{text:"各城市全年平均气温",left:"center"},
        tooltip:{trigger:"axis"},
        xAxis:{data:cityList},
        yAxis:{type:"value", name:"℃"},
        series:[{
            type:"bar",
            data:avgTempList,
            name:"平均气温"
        }]
    })
};

// 折线图保持空壳占位，不报错
const renderLineChart = (data) => {};

// resize只处理barChart
window.addEventListener('resize',()=>{
    if(barChart) barChart.resize();
});

// jQuery交互暂不启用

loadData();


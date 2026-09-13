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
        renderBarChart(data);
        renderLineChart(data);
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

// 修复后的折线图代码，锁定Y轴范围，解决拉伸溢出
const renderLineChart = (data) => {
    if(lineChart) lineChart.destroy();
    const ctx = document.querySelector('#line-chart');
    lineChart = new Chart(ctx,{
        type:'line',
        data:{
            labels: data.months,
            datasets: data.series.map(s=>({
                label:s.city,
                data:s.counts,
                fill:false,
                tension:0.2
            }))
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            plugins:{
                title:{
                    display:true,
                    text:"月度气温变化趋势，单位：℃"
                }
            },
            scales:{
                y:{
                    min:-5,
                    max:32,
                    title:{
                        display:true,
                        text:"气温 ℃"
                    }
                }
            }
        }
    })
};

window.addEventListener('resize',()=>{
    if(barChart) barChart.resize();
});

// jQuery交互：点击卡片高亮
$('#cards').on('click','.card',function(){
    $(this).toggleClass('border-primary shadow');
})

loadData();


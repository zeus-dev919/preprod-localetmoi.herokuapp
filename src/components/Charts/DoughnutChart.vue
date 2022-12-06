<script>
import { Doughnut, mixins } from 'vue-chartjs';
import { mapState } from 'vuex';
export default {
    extends: Doughnut,
    name: 'DoughnutChart',
    mixins: [...mixins],
    props: ['datas', 'labels', 'colors', 'label', 'styles'],
    data: () => ({
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'bottom'
            },
            title: {
                display: true,
                text: this.label || '',
                fontSize: 20,
                fontColor: '#2E2F2F'
            }
        }
    }),
    mounted () {
        this.renderAndUpdateBackground();
    },
    methods: {
        getRandomRGBNumber() {
            return Math.random() * 255;
        },
        renderAndUpdateBackground() {
            this.renderChart({
                labels: this.labels,
                datasets: [
                    {
                        label: 'Sources',
                        data: this.datas,
                        backgroundColor: this.colors,
                        hoverOffset: 4,
                        hoverBackgroundColor: `rgb(236, ${this.getRandomRGBNumber()}, 140)`,
                        hoverBorderColor: `rgb(236, ${this.getRandomRGBNumber()}, 140)`
                    }
                ]
            }, {
                ...this.options,
                title: {
                    ...this.options.title,
                    text: this.label || ''
                }
            });
            this.$nextTick(() => {
                const lineChart = document.querySelector('#doughnut-chart');
                if (lineChart && lineChart.style) {
                    lineChart.style.backgroundColor = '#E5E5E5';
                    lineChart.style.padding = (this.styles || {}).padding || '20px';
                    lineChart.style.height = (this.styles || {}).height || '400px';
                    lineChart.style.width = (this.styles || {}).width || '391px';
                    lineChart.style['border-radius'] = '5px';
                }
            });
        }
    },
    computed: {
        ...mapState('globalStore', ['filterAudienceRange'])
    },
    watch: {
        datas() {
            this.renderAndUpdateBackground();
        }
    }
}
</script>

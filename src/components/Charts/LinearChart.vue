<script>
import { Line, mixins } from 'vue-chartjs';
import { dateHelpers } from '../../_helpers';
import { mapState } from 'vuex';

export default {
    extends: Line,
    name: 'LinearChart',
    mixins: [...mixins],
    props: ['datas', 'label', 'labels', 'elementLabel', 'styles'],
    data: () => ({
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                text: this.label || '',
                fontSize: 20,
                fontColor: '#2E2F2F'
            }
        },
        months: dateHelpers.months
    }),
    methods: {
        renderAndUpdateBackground() {
            this.renderChart(
                {
                    labels: this.labels.length ? this.labels : this.months,
                    datasets: [
                        {
                            label: this.elementLabel,
                            borderColor: '#ec008c',
                            fill: false,
                            data: this.datas,
                            hoverOffset: 4,
                            pointBackgroundColor: '#ffffff',
                            pointBorderColor: '#ec008c'
                        }
                    ]
                },
                {
                    ...this.options,
                    title: {
                        ...this.options.title,
                        text: this.label || ''
                    }
                }
            );
            this.$nextTick(() => {
                const lineChart = document.querySelector('#line-chart');
                if (lineChart && lineChart.style) {
                    lineChart.style.backgroundColor = '#E5E5E5';
                    lineChart.style.padding = (this.styles || {}).padding || '20px';
                    lineChart.style.width = (this.styles || {}).width || '1345px';
                    lineChart.style['border-radius'] = '5px';
                }
            });
        }
    },
    mounted() {
        this.renderAndUpdateBackground();
    },
    computed: {
        ...mapState('globalStore', ['filterAudienceRange'])
    },
    watch: {
        datas() {
            this.renderAndUpdateBackground();
        }
    }
};
</script>

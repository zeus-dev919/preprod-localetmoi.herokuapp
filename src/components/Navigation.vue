<script>

export default {
    name: 'Navigation',
    methods: {
        refreshPage: function () {
            if (!localStorage.getItem('reloading')) {
                localStorage.setItem('reloading', true);
                location.reload();
            }
        }
    }
};
</script>

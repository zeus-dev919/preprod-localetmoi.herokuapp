<template>

</template>

<script>
export default {
    bind(el) {
        el.addEventListener('focus', () => {
            el.style.overflowY = 'visible';
            el.style.resize = 'none';
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
            el.scrollTop = el.scrollHeight;
        });
    },
    inserted: function (el) {
        function onInputChange() {
            this.style.height = 'auto';
            this.style.height = `${el.scrollHeight}px`;
            this.scrollTop = el.scrollHeight;
        }

        el.addEventListener("input", onInputChange, false);
    },

};
</script>

<style scoped>

</style>

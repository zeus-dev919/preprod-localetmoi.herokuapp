<template>
    <small class="maxlength-message is-valid">
        {{ textLength }}/{{ maxlength }} caractère{{ maxlength > 1 ? 's' : '' }}
    </small>
</template>

<script>
export default {
    name: "TextLengthMessage",
    props: [
        'value',
        'maxlength',
    ],
    computed: {
        textLength() {
            return this.value ? this.value.length : 0;
        },
    },
}
</script>

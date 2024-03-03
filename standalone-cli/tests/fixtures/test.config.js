module.exports = {
  plugins: [
    require('@segmentdesign/aspect-ratio'),
    require('@segmentdesign/container-queries'),
    require('@segmentdesign/forms')({ strategy: 'class' }),
    require('@segmentdesign/line-clamp'),
    require('@segmentdesign/typography'),
  ],
}

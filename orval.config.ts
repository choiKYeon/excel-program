export default {
  "olhso-base-backend": {
    output: {
      target: "src/api/generated2/service",
      schemas: "src/api/generated2/model",
      mode: "tags-split",
    },
    input: "https://base-dev.olhso.com/olhso/docs-json",
  },
};
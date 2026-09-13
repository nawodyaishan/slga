import studio from "@sanity/eslint-config-studio";

const eslintConfig = [
  ...studio,
  {
    settings: {
      react: { version: "19.3" },
    },
  },
];

export default eslintConfig;

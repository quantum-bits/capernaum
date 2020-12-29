module.exports = {
  moduleFileExtensions: ["ts", "js"],
  rootDir: ".",
  roots: ["<rootDir>/apps"],
  preset: "ts-jest",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@server/(.*)$": "<rootDir>/apps/server/$1",
    "^@reporter/(.*)$": "<rootDir>/apps/reporter/$1",
  },
};

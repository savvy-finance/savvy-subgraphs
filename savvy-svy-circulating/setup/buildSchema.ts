import chalk from "chalk";
import fs from "fs";
import path from "path";

async function main() {
  const schemaFileNames = [
    "header",
    "blockchainPrimitives",
    // "todo",
    "savvyAccount",
    "savvySvy",
    "savvyVeSvy",
    "savvyBooster",
  ];

  const schemas = schemaFileNames.map((schemaFileName) => {
    return fs.readFileSync(
      path.resolve(__dirname, `./schemas/${schemaFileName}.schemas.graphql`),
      "utf8"
    );
  });

  const schema = schemas.join("\n");
  try {
    fs.writeFileSync("./schema.graphql", schema);
    console.log(chalk.green("Success! Wrote `schema.graphql`"));
  } catch (error) {
    console.log(
      `${chalk.red("ERROR:")} ${chalk.yellow("Failed to write schema.graphql")}`
    );
    throw error;
  }
}

main().catch((error) => {
  console.log(error);
});

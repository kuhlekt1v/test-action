import { Octokit } from "octokit";
import "dotenv/config";

async function main() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const project = await octokit.request(
    "GET /users/{owner}/test-actions/projects/2",
    {
      owner: "kuhlekt1v",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  console.log(project);
}

main();

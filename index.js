const fetch = require("node-fetch");

const repoToken = process.env.GITHUB_TOKEN;
const project = "Test Actions";
const column = "In Progress";

async function moveIssueToColumn(issueNumber) {
  const url = `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/projects`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${repoToken}`,
    },
  });

  const projects = await response.json();
  const projectData = projects.find((proj) => proj.name === project);

  if (!projectData) {
    console.error(`Project "${project}" not found.`);
    return;
  }

  const columnUrl = `https://api.github.com/projects/columns/${
    projectData.columns_url.split("/columns/")[1]
  }`;

  const issueUrl = `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/issues/${issueNumber}`;

  const moveResponse = await fetch(columnUrl + "/cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${repoToken}`,
    },
    body: JSON.stringify({
      content_id: (await (await fetch(issueUrl)).json()).id,
      content_type: "Issue",
    }),
  });

  return moveResponse;
}

async function main() {
  const issueNumber = process.env.ISSUE_NUMBER;
  if (!issueNumber) {
    console.error("Issue number not provided.");
    return;
  }

  try {
    const response = await moveIssueToColumn(issueNumber);
    if (response.status === 201) {
      console.log(`Issue ${issueNumber} moved to '${column}' column.`);
    } else {
      console.error(
        `Failed to move issue ${issueNumber}: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("An error occurred:", error.message || error);
  }
}

main();

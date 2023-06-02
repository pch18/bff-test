const fetchBranchRaw = `0014command=ls-refs
0024agent=git/2.32.0.(Apple.Git-132)0016object-format=sha100010009peel
000bunborn
0014ref-prefix HEAD
001bref-prefix refs/heads/
0000`;

export const fetchGitBranchInfo = async (repoUrl: string) => {
  const res = await fetch(`${repoUrl}/git-upload-pack`, {
    headers: {
      "Git-Protocol": "version=2",
    },
    body: fetchBranchRaw,
    method: "POST",
  }).then(async (r) => await r.text());
  const rows = res.split("\n").map((r) => r.slice(4));
  const branchs = rows.slice(1, rows.length - 1).map((r) => {
    const [commitId, branchName] = r.split(" ");
    return { commitId, branchName: branchName?.replace(/^refs\/heads\//, "") };
  });
  const headCommitId = rows[0]?.slice(0, 40);
  const headBranchName =
    branchs.find((b) => b.commitId === headCommitId)?.branchName ?? "";

  return { repoUrl, branchs, headCommitId, headBranchName };
};

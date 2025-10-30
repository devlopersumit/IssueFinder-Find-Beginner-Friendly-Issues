import React from 'react'
import { useFetchIssues } from '../hooks/useFetchIssues'

type IssueListProps = {
  className?: string
  query: string
}

const IssueList: React.FC<IssueListProps> = ({ className = '', query }) => {
  const { data, isLoading, error } = useFetchIssues(query)
  return (
    <section className={`bg-white ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Beginner-Friendly Issues</h2>
          <div className="text-sm text-gray-500">
            {isLoading ? 'Loading…' : error ? 'Error' : `${data?.total_count ?? 0} results`}
          </div>
        </div>
        <div className="mt-4 divide-y rounded-md border">
          {(data?.items ?? [1, 2, 3]).slice(0, 10).map((item: any, idx: number) => {
          
            if (!data || !Array.isArray(data.items)) {
              return (
                <article key={`placeholder-${idx}`} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-indigo-600 font-medium">Sample issue title #{idx + 1}</span>
                      <p className="mt-1 text-sm text-gray-600">owner/repo • #123{idx + 1} • opened 2 days ago</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">good first issue</span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">help wanted</span>
                      </div>
                    </div>
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Open</span>
                  </div>
                </article>
              )
            }
            const issue = item
            const repo = issue.repository_url?.split('/').slice(-2).join('/')
            return (
              <article key={issue.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <a href={issue.html_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-medium">
                      {issue.title}
                    </a>
                    <p className="mt-1 text-sm text-gray-600">{repo} • #{issue.number}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(issue.labels || []).slice(0, 3).map((l: any, i: number) => (
                        <span key={`${issue.id}-label-${i}`} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">{l?.name ?? 'label'}</span>
                      ))}
                    </div>
                  </div>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Open</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default IssueList



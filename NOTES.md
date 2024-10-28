# API Endponts

## What an unauthenticated user can do:
Check API Status
- [ ] ```GET /```


## Must be authenticated
If marked with 'protected'

### User related

- [ ] ```POST /auth/signup```
- [ ] ```POST /auth/login```
- [ ] ```GET /auth/me	protected```
- [ ] ```POST /auth/logout	protected```
- [ ] ```GET /auth/me```
- [ ] ```GET /users```
- [ ] ```GET /users/:id```
- [ ] ```PUT /users/:id	protected```
- [ ] ```DELETE /users/:id	protected```

### Company related

- [ ] ```GET /companies```
- [ ] ```GET /companies/:id```
- [ ] ```POST /companies	protected```
- [ ] ```PUT /companies/:id	protected```
- [ ] ```DELETE /companies/:id	protected```

### Company-Application interactions (protected)
- [ ] ```GET companies/company_id/jobs/job_id/applications```
- [ ] ```PATCH companies/company_id/jobs/job_id/applications/accept```
- [ ] ```PATCH companies/company_id/jobs/job_id/applications/review```
- [ ] ```PATCH companies/company_id/jobs/job_id/applications/review```


### Jobs related

- [ ] ```GET /jobs```
- [ ] ```GET /jobs/:id```
- [ ] ```GET /jobs/search```
- [ ] ```POST /jobs	protected```
- [ ] ```PUT /jobs/:id	protected```
- [ ] ```DELETE /jobs/:id	protected```

### Applications

- [ ] ```GET /applications	protected```
- [ ] ```GET /applications/:id	protected```
- [ ] ```POST /applications	protected```
- [ ] ```PUT /applications/:id	protected```
- [ ] ```DELETE /applications/:id	protected```

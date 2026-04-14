'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { buildResourcesSubNavItems } from '@/components/manage_business/workspace/resources-navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { ApiErrorResponse } from '@/types/auth'
import type { Business, BusinessListResponse } from '@/types/business'
import type {
  CreateResourcePayload,
  Resource,
  ResourceListResponse,
  ResourceMutationResponse,
  ResourceType,
  UpdateResourcePayload,
} from '@/types/resource'

const RESOURCE_TYPES: ResourceType[] = [
  'ROOM',
  'CHAIR',
  'BED',
  'TABLE',
  'STATION',
  'EQUIPMENT',
  'OTHER',
]

const getApiErrorMessage = (payload: unknown, fallback: string) => {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string' &&
    payload.message.trim().length
  ) {
    return payload.message
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload &&
    typeof payload.error === 'string' &&
    payload.error.trim().length
  ) {
    return payload.error
  }

  return fallback
}

const buildInitialForm = () => ({
  type: 'ROOM' as ResourceType,
  name: '',
  capacity: '1',
})

const formatResourceTypeLabel = (value: ResourceType) =>
  value
    .toLowerCase()
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

function ManageBusinessResourcesPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isLoadingResources, setIsLoadingResources] = useState(false)
  const [isSavingResource, setIsSavingResource] = useState(false)
  const [isUpdatingResourceId, setIsUpdatingResourceId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null)
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null)
  const [resourceForm, setResourceForm] = useState(buildInitialForm())

  const selectedBusiness = useMemo(
    () => businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0] ?? null,
    [businesses, selectedBusinessId]
  )

  const selectedResource = useMemo(
    () => resources.find((resource) => resource.id === selectedResourceId) ?? resources[0] ?? null,
    [resources, selectedResourceId]
  )

  useEffect(() => {
    let ignore = false

    async function loadBusinesses() {
      setIsLoadingBusinesses(true)

      try {
        const response = await fetch('/api/businesses', { method: 'GET', cache: 'no-store' })
        const payload = (await response.json()) as BusinessListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setErrorMessage(getApiErrorMessage(payload, 'We could not load your businesses right now.'))
          setBusinesses([])
          return
        }

        setBusinesses((payload as BusinessListResponse).businesses)
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load your businesses right now.')
          setBusinesses([])
        }
      } finally {
        if (!ignore) setIsLoadingBusinesses(false)
      }
    }

    void loadBusinesses()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!businesses.length) return

    const hasValidSelection = selectedBusinessId
      ? businesses.some((business) => business.id === selectedBusinessId)
      : false

    if (!hasValidSelection) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('businessId', businesses[0].id)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [businesses, pathname, router, searchParams, selectedBusinessId])

  useEffect(() => {
    if (!selectedBusinessId) {
      setResources([])
      return
    }

    let ignore = false

    async function loadResources() {
      setIsLoadingResources(true)
      setErrorMessage(null)

      try {
        const response = await fetch(`/api/businesses/${selectedBusinessId}/resources?include_inactive=true`, {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as ResourceListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setErrorMessage(getApiErrorMessage(payload, 'We could not load resources right now.'))
          setResources([])
          return
        }

        const nextResources = (payload as ResourceListResponse).resources
        setResources(nextResources)
        setSelectedResourceId((currentValue) => {
          if (currentValue && nextResources.some((resource) => resource.id === currentValue)) {
            return currentValue
          }
          return nextResources[0]?.id ?? null
        })
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load resources right now.')
          setResources([])
        }
      } finally {
        if (!ignore) setIsLoadingResources(false)
      }
    }

    void loadResources()

    return () => {
      ignore = true
    }
  }, [selectedBusinessId])

  useEffect(() => {
    if (!editingResourceId) return

    const editingResource = resources.find((resource) => resource.id === editingResourceId)
    if (!editingResource) {
      setEditingResourceId(null)
      return
    }

    setResourceForm({
      type: editingResource.type,
      name: editingResource.name,
      capacity: String(editingResource.capacity),
    })
  }, [editingResourceId, resources])

  const activeResources = resources.filter((resource) => resource.isActive)
  const inactiveResources = resources.filter((resource) => !resource.isActive)
  const totalCapacity = resources.reduce((sum, resource) => sum + resource.capacity, 0)

  const updateSelectedBusinessId = (businessId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('businessId', businessId)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  async function handleSaveResource(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedBusinessId) return

    setIsSavingResource(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const payload: CreateResourcePayload | UpdateResourcePayload = {
      type: resourceForm.type,
      name: resourceForm.name.trim(),
      capacity: Number(resourceForm.capacity),
    }

    try {
      const response = await fetch(
        editingResourceId
          ? `/api/businesses/${selectedBusinessId}/resources/${editingResourceId}`
          : `/api/businesses/${selectedBusinessId}/resources`,
        {
          method: editingResourceId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      const body = (await response.json()) as ResourceMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(body, 'We could not save this resource right now.'))
        return
      }

      const resource = (body as ResourceMutationResponse).resource
      setResources((currentValue) => {
        if (editingResourceId) {
          return currentValue.map((item) => (item.id === resource.id ? resource : item))
        }

        return [...currentValue, resource].sort((leftValue, rightValue) =>
          leftValue.name.localeCompare(rightValue.name)
        )
      })
      setSelectedResourceId(resource.id)
      setEditingResourceId(null)
      setResourceForm(buildInitialForm())
      setSuccessMessage((body as ResourceMutationResponse).message)
    } catch {
      setErrorMessage('We could not save this resource right now.')
    } finally {
      setIsSavingResource(false)
    }
  }

  async function handleToggleResource(resource: Resource) {
    if (!selectedBusinessId) return

    setIsUpdatingResourceId(resource.id)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/businesses/${selectedBusinessId}/resources/${resource.id}/active`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: !resource.isActive }),
        }
      )

      const payload = (await response.json()) as ResourceMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not update this resource right now.'))
        return
      }

      const updatedResource = (payload as ResourceMutationResponse).resource
      setResources((currentValue) =>
        currentValue.map((item) => (item.id === updatedResource.id ? updatedResource : item))
      )
      setSuccessMessage((payload as ResourceMutationResponse).message)
    } catch {
      setErrorMessage('We could not update this resource right now.')
    } finally {
      setIsUpdatingResourceId(null)
    }
  }

  return (
    <ManageBusinessShell
      activeNav="/manage_business/resources"
      subNavItems={buildResourcesSubNavItems(selectedBusiness?.id ?? null)}
      activeSubNav={pathname}
    >
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Resource workspace issue</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert className="mb-6 rounded-2xl">
          <AlertTitle>Updated</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      {isLoadingBusinesses ? (
        <div className="grid gap-6">
          <div className="h-40 animate-pulse rounded-[28px] bg-white" />
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-[24px] bg-white" />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-[28px] bg-white" />
        </div>
      ) : !businesses.length ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
            No business selected
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0B1C30]">
            Add a business before configuring shared resources
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Resources are the shared rooms, chairs, stations, and equipment that services compete for.
          </p>
          <Link
            href="/start-business"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Start a business
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Resource inventory
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B1C30]">
                  Shared capacity for real-world operations
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-500">
                  Add the rooms, chairs, beds, stations, and equipment that services need before they
                  can be booked. Service rules will use this inventory to suppress overbooked slots.
                </p>
              </div>

              <div className="grid gap-2 sm:min-w-[260px]">
                <label className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Active business
                </label>
                <select
                  value={selectedBusiness?.id ?? ''}
                  onChange={(event) => updateSelectedBusinessId(event.target.value)}
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-[#0B1C30] outline-none transition focus:border-[#0B1C30] focus:bg-white"
                >
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Total resources</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{resources.length}</p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Active pools</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{activeResources.length}</p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Inactive pools</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{inactiveResources.length}</p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Total capacity</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{totalCapacity}</p>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Resource pools
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                    {selectedBusiness?.name}
                  </h2>
                </div>
                {isLoadingResources ? <span className="text-xs font-semibold text-slate-400">Loading...</span> : null}
              </div>

              <div className="mt-5 grid gap-3">
                {resources.length ? (
                  resources.map((resource) => {
                    const isSelected = selectedResource?.id === resource.id

                    return (
                      <div
                        key={resource.id}
                        className={`rounded-2xl border px-4 py-4 transition-colors ${
                          isSelected
                            ? 'border-[#0B1C30] bg-slate-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <button
                            type="button"
                            onClick={() => setSelectedResourceId(resource.id)}
                            className="text-left"
                          >
                            <p className="text-sm font-semibold text-[#0B1C30]">{resource.name}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatResourceTypeLabel(resource.type)} • Capacity {resource.capacity}
                            </p>
                          </button>

                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                resource.isActive
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {resource.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingResourceId(resource.id)}
                              className="inline-flex rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleResource(resource)}
                              disabled={isUpdatingResourceId === resource.id}
                              className="inline-flex rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isUpdatingResourceId === resource.id
                                ? 'Saving...'
                                : resource.isActive
                                  ? 'Deactivate'
                                  : 'Activate'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-sm text-slate-500">
                    No pooled resources yet. Create the first one so services can reserve real-world capacity.
                  </div>
                )}
              </div>
            </article>

            <div className="grid gap-6">
              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Resource editor
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                      {editingResourceId ? 'Edit selected resource' : 'Add a resource pool'}
                    </h2>
                  </div>
                  {editingResourceId ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingResourceId(null)
                        setResourceForm(buildInitialForm())
                      }}
                      className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                    >
                      Reset
                    </button>
                  ) : null}
                </div>

                <form onSubmit={handleSaveResource} className="mt-5 grid gap-4">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Resource type
                    <select
                      value={resourceForm.type}
                      onChange={(event) =>
                        setResourceForm((currentValue) => ({
                          ...currentValue,
                          type: event.target.value as ResourceType,
                        }))
                      }
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                    >
                      {RESOURCE_TYPES.map((resourceType) => (
                        <option key={resourceType} value={resourceType}>
                          {formatResourceTypeLabel(resourceType)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Name
                    <input
                      value={resourceForm.name}
                      onChange={(event) =>
                        setResourceForm((currentValue) => ({
                          ...currentValue,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Treatment Room A"
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Capacity
                    <input
                      type="number"
                      min="1"
                      value={resourceForm.capacity}
                      onChange={(event) =>
                        setResourceForm((currentValue) => ({
                          ...currentValue,
                          capacity: event.target.value,
                        }))
                      }
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isSavingResource}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSavingResource
                      ? 'Saving...'
                      : editingResourceId
                        ? 'Update resource'
                        : 'Create resource'}
                  </button>
                </form>
              </article>

              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Next step
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                  Connect resources to services
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Once the resource pools exist, choose a service and define how many units it consumes.
                  Availability will then hide slots whenever the shared capacity is already in use.
                </p>
                <Link
                  href={selectedBusiness ? `/manage_business/services?businessId=${selectedBusiness.id}` : '/manage_business/services'}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                >
                  Configure service rules
                </Link>
              </article>
            </div>
          </section>
        </div>
      )}
    </ManageBusinessShell>
  )
}

function ManageBusinessResourcesPageFallback() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] p-5 md:p-6">
      <div className="grid gap-6">
        <div className="h-40 animate-pulse rounded-[28px] bg-white" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[24px] bg-white" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-[28px] bg-white" />
      </div>
    </div>
  )
}

export default function ManageBusinessResourcesPage() {
  return (
    <Suspense fallback={<ManageBusinessResourcesPageFallback />}>
      <ManageBusinessResourcesPageContent />
    </Suspense>
  )
}

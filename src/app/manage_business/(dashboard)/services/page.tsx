'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Availability, AvailabilityResponse } from '@/types/availability'
import type { ApiErrorResponse } from '@/types/auth'
import type { Business, BusinessListResponse } from '@/types/business'
import type {
  Service,
  ServiceCategory,
  ServiceCategoryListResponse,
  ServiceCategoryMutationResponse,
  ServiceListResponse,
  ServiceMutationResponse,
} from '@/types/service'
import type { ServiceStaffAssignmentResponse, StaffMember } from '@/types/staff'

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

const getStatusClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'PENDING':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'SUSPENDED':
      return 'border-red-200 bg-red-50 text-red-700'
    default:
      return 'border-slate-200 bg-slate-50 text-slate-600'
  }
}

const buildTodayDate = () => new Date().toISOString().slice(0, 10)

const buildInitialServiceForm = (categoryId = '') => ({
  serviceCategoryId: categoryId,
  name: '',
  description: '',
  durationMinutes: '30',
  priceAmount: '0.00',
  depositAmount: '',
  allowCashPayment: false,
})

const formatSlotTime = (value: string, timezone: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  }).format(date)
}

function ManageBusinessServicesPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [assignedStaff, setAssignedStaff] = useState<StaffMember[]>([])
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false)
  const [isSavingCategory, setIsSavingCategory] = useState(false)
  const [isSavingService, setIsSavingService] = useState(false)
  const [isUpdatingServiceId, setIsUpdatingServiceId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [serviceForm, setServiceForm] = useState(buildInitialServiceForm())
  const [availabilityDate, setAvailabilityDate] = useState(buildTodayDate())
  const [availabilityStaffId, setAvailabilityStaffId] = useState('ALL')

  const selectedBusiness = useMemo(
    () => businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0] ?? null,
    [businesses, selectedBusinessId]
  )

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? services[0] ?? null,
    [services, selectedServiceId]
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
      setCategories([])
      setServices([])
      return
    }

    let ignore = false

    async function loadWorkspace() {
      setIsLoadingWorkspace(true)
      setErrorMessage(null)

      try {
        const [categoriesResponse, servicesResponse] = await Promise.all([
          fetch(`/api/businesses/${selectedBusinessId}/service-categories`, {
            method: 'GET',
            cache: 'no-store',
          }),
          fetch(`/api/businesses/${selectedBusinessId}/services?include_inactive=true`, {
            method: 'GET',
            cache: 'no-store',
          }),
        ])

        const [categoriesPayload, servicesPayload] = await Promise.all([
          categoriesResponse.json(),
          servicesResponse.json(),
        ])

        if (ignore) return

        if (!categoriesResponse.ok) {
          setErrorMessage(
            getApiErrorMessage(categoriesPayload, 'We could not load service categories right now.')
          )
          setCategories([])
        } else {
          const nextCategories = (categoriesPayload as ServiceCategoryListResponse).categories
          setCategories(nextCategories)
          setServiceForm((currentValue) => ({
            ...currentValue,
            serviceCategoryId: currentValue.serviceCategoryId || nextCategories[0]?.id || '',
          }))
        }

        if (!servicesResponse.ok) {
          setErrorMessage(getApiErrorMessage(servicesPayload, 'We could not load services right now.'))
          setServices([])
          return
        }

        const nextServices = (servicesPayload as ServiceListResponse).services
        setServices(nextServices)
        setSelectedServiceId((currentValue) => {
          if (currentValue && nextServices.some((service) => service.id === currentValue)) {
            return currentValue
          }
          return nextServices[0]?.id ?? null
        })
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load the services workspace right now.')
          setCategories([])
          setServices([])
        }
      } finally {
        if (!ignore) setIsLoadingWorkspace(false)
      }
    }

    void loadWorkspace()

    return () => {
      ignore = true
    }
  }, [selectedBusinessId])

  useEffect(() => {
    if (!selectedBusinessId || !selectedService) {
      setAssignedStaff([])
      setAvailability(null)
      return
    }

    let ignore = false

    async function loadSelectedServiceContext() {
      try {
        const availabilityQuery = new URLSearchParams({ date: availabilityDate })
        if (availabilityStaffId !== 'ALL') {
          availabilityQuery.set('staff_member_id', availabilityStaffId)
        }

        const [staffResponse, availabilityResponse] = await Promise.all([
          fetch(
            `/api/businesses/${selectedBusinessId}/services/${selectedService.id}/staff-members?include_inactive=true`,
            { method: 'GET', cache: 'no-store' }
          ),
          fetch(
            `/api/businesses/${selectedBusinessId}/services/${selectedService.id}/availability?${availabilityQuery.toString()}`,
            { method: 'GET', cache: 'no-store' }
          ),
        ])

        const [staffPayload, availabilityPayload] = await Promise.all([
          staffResponse.json(),
          availabilityResponse.json(),
        ])

        if (ignore) return

        if (!staffResponse.ok) {
          setErrorMessage(getApiErrorMessage(staffPayload, 'We could not load service staff right now.'))
          setAssignedStaff([])
        } else {
          setAssignedStaff((staffPayload as ServiceStaffAssignmentResponse).staffMembers)
        }

        if (!availabilityResponse.ok) {
          setAvailability(null)
          return
        }

        setAvailability((availabilityPayload as AvailabilityResponse).availability)
      } catch {
        if (!ignore) setAvailability(null)
      }
    }

    void loadSelectedServiceContext()

    return () => {
      ignore = true
    }
  }, [availabilityDate, availabilityStaffId, selectedBusinessId, selectedService])

  useEffect(() => {
    if (!editingServiceId) return

    const editingService = services.find((service) => service.id === editingServiceId)
    if (!editingService) {
      setEditingServiceId(null)
      return
    }

    setServiceForm({
      serviceCategoryId: editingService.serviceCategoryId,
      name: editingService.name,
      description: editingService.description ?? '',
      durationMinutes: String(editingService.durationMinutes),
      priceAmount: editingService.priceAmount,
      depositAmount: editingService.depositAmount === '0.00' ? '' : editingService.depositAmount,
      allowCashPayment: editingService.allowCashPayment,
    })
  }, [editingServiceId, services])

  const activeServices = services.filter((service) => service.isActive)
  const staffWorkspaceHref = selectedBusiness
    ? `/manage_business/staff?businessId=${selectedBusiness.id}`
    : '/manage_business/staff'

  const updateSelectedBusinessId = (businessId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('businessId', businessId)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedBusinessId) return

    setIsSavingCategory(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`/api/businesses/${selectedBusinessId}/service-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName, sort_order: categories.length }),
      })

      const payload = (await response.json()) as ServiceCategoryMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not create this category right now.'))
        return
      }

      const category = (payload as ServiceCategoryMutationResponse).category
      setCategories((currentValue) => [...currentValue, category])
      setCategoryName('')
      setServiceForm((currentValue) => ({
        ...currentValue,
        serviceCategoryId: currentValue.serviceCategoryId || category.id,
      }))
      setSuccessMessage(payload.message)
    } catch {
      setErrorMessage('We could not create this category right now.')
    } finally {
      setIsSavingCategory(false)
    }
  }

  async function handleSaveService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedBusinessId) return

    setIsSavingService(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const requestBody = {
      service_category_id: serviceForm.serviceCategoryId,
      name: serviceForm.name,
      description: serviceForm.description.trim() ? serviceForm.description.trim() : null,
      duration_minutes: Number(serviceForm.durationMinutes),
      price_amount: serviceForm.priceAmount,
      deposit_amount: serviceForm.depositAmount.trim() ? serviceForm.depositAmount.trim() : null,
      currency: 'GBP',
      allow_cash_payment: serviceForm.allowCashPayment,
    }

    try {
      const response = await fetch(
        editingServiceId
          ? `/api/businesses/${selectedBusinessId}/services/${editingServiceId}`
          : `/api/businesses/${selectedBusinessId}/services`,
        {
          method: editingServiceId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      )

      const payload = (await response.json()) as ServiceMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not save this service right now.'))
        return
      }

      const service = (payload as ServiceMutationResponse).service
      setServices((currentValue) => {
        if (editingServiceId) {
          return currentValue.map((item) => (item.id === service.id ? service : item))
        }
        return [service, ...currentValue]
      })
      setSelectedServiceId(service.id)
      setEditingServiceId(null)
      setServiceForm(buildInitialServiceForm(categories[0]?.id ?? service.serviceCategoryId))
      setSuccessMessage(payload.message)
    } catch {
      setErrorMessage('We could not save this service right now.')
    } finally {
      setIsSavingService(false)
    }
  }

  async function handleToggleService(service: Service) {
    if (!selectedBusinessId) return

    setIsUpdatingServiceId(service.id)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/businesses/${selectedBusinessId}/services/${service.id}/active`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: !service.isActive }),
        }
      )

      const payload = (await response.json()) as ServiceMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not update this service right now.'))
        return
      }

      const updatedService = (payload as ServiceMutationResponse).service
      setServices((currentValue) =>
        currentValue.map((item) => (item.id === updatedService.id ? updatedService : item))
      )
      setSuccessMessage(payload.message)
    } catch {
      setErrorMessage('We could not update this service right now.')
    } finally {
      setIsUpdatingServiceId(null)
    }
  }

  return (
    <ManageBusinessShell activeNav="/manage_business/services">
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Services workspace issue</AlertTitle>
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
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Services Workspace
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            No business selected yet
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Create a business first, then return here to build categories, services, and availability.
          </p>
          <Link
            href="/start-business"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Start owner onboarding
          </Link>
        </section>
      ) : (
        <div className="flex flex-col gap-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Services Workspace
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30] md:text-4xl">
                  Services, pricing, and bookable slots
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Build the public service catalog, keep pricing aligned, and preview the real
                  availability customers will see after staff assignments are in place.
                </p>
              </div>

              <div className="grid gap-3 sm:min-w-[300px]">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Active business
                  <select
                    value={selectedBusiness?.id ?? ''}
                    onChange={(event) => updateSelectedBusinessId(event.target.value)}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  >
                    {businesses.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                      </option>
                    ))}
                  </select>
                </label>
                {selectedBusiness ? (
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
                        selectedBusiness.status
                      )}`}
                    >
                      {selectedBusiness.status}
                    </span>
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                      {selectedBusiness.city}, {selectedBusiness.postcode}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Categories</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{categories.length}</p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Total services</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{services.length}</p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Active listings</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{activeServices.length}</p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Cash enabled</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {services.filter((service) => service.allowCashPayment).length}
              </p>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Service categories</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">Organize the catalog</h2>
              <form onSubmit={handleCreateCategory} className="mt-5 grid gap-3">
                <input
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="Add a category name"
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={isSavingCategory}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSavingCategory ? 'Saving...' : 'Create category'}
                </button>
              </form>
              <div className="mt-5 grid gap-2">
                {categories.length ? (
                  categories.map((category) => (
                    <div key={category.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-sm font-semibold text-[#0B1C30]">{category.name}</p>
                      <p className="mt-1 text-xs text-slate-500">Sort order {category.sortOrder}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    Create your first category so services can be grouped cleanly on the customer side.
                  </div>
                )}
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Service builder</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                    {editingServiceId ? 'Edit selected service' : 'Add a new service'}
                  </h2>
                </div>
                {editingServiceId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingServiceId(null)
                      setServiceForm(buildInitialServiceForm(categories[0]?.id ?? ''))
                    }}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                  >
                    Reset
                  </button>
                ) : null}
              </div>

              <form onSubmit={handleSaveService} className="mt-5 grid gap-4 lg:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Category
                  <select
                    value={serviceForm.serviceCategoryId}
                    onChange={(event) => setServiceForm((currentValue) => ({ ...currentValue, serviceCategoryId: event.target.value }))}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Service name
                  <input
                    value={serviceForm.name}
                    onChange={(event) => setServiceForm((currentValue) => ({ ...currentValue, name: event.target.value }))}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 lg:col-span-2">
                  Description
                  <textarea
                    value={serviceForm.description}
                    onChange={(event) => setServiceForm((currentValue) => ({ ...currentValue, description: event.target.value }))}
                    rows={4}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Duration (minutes)
                  <input
                    type="number"
                    min="1"
                    value={serviceForm.durationMinutes}
                    onChange={(event) => setServiceForm((currentValue) => ({ ...currentValue, durationMinutes: event.target.value }))}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Price (GBP)
                  <input
                    value={serviceForm.priceAmount}
                    onChange={(event) => setServiceForm((currentValue) => ({ ...currentValue, priceAmount: event.target.value }))}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Deposit (optional)
                  <input
                    value={serviceForm.depositAmount}
                    onChange={(event) => setServiceForm((currentValue) => ({ ...currentValue, depositAmount: event.target.value }))}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={serviceForm.allowCashPayment}
                    onChange={(event) => setServiceForm((currentValue) => ({ ...currentValue, allowCashPayment: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-[#0B1C30] focus:ring-[#0B1C30]"
                  />
                  Allow cash payment on arrival
                </label>
                <div className="lg:col-span-2 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isSavingService || !categories.length}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSavingService ? 'Saving...' : editingServiceId ? 'Update service' : 'Create service'}
                  </button>
                  <Link
                    href={staffWorkspaceHref}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                  >
                    Configure staff assignments
                  </Link>
                </div>
              </form>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Service catalog</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">Live services for this business</h2>
                </div>
                {isLoadingWorkspace ? <span className="text-xs font-semibold text-slate-400">Loading...</span> : null}
              </div>
              <div className="mt-5 grid gap-3">
                {services.length ? services.map((service) => {
                  const isSelected = selectedService?.id === service.id
                  return (
                    <div key={service.id} className={`rounded-2xl border px-4 py-4 transition-colors ${isSelected ? 'border-[#0B1C30] bg-slate-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <button type="button" onClick={() => setSelectedServiceId(service.id)} className="text-left">
                          <p className="text-sm font-semibold text-[#0B1C30]">{service.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{service.serviceCategoryName} • {service.durationMinutes} mins • £{service.priceAmount}</p>
                        </button>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${service.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{service.isActive ? 'Active' : 'Inactive'}</span>
                          <button type="button" onClick={() => setEditingServiceId(service.id)} className="inline-flex rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50">Edit</button>
                          <button type="button" onClick={() => handleToggleService(service)} disabled={isUpdatingServiceId === service.id} className="inline-flex rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
                            {isUpdatingServiceId === service.id ? 'Saving...' : service.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-500">{service.description ?? 'No description added yet.'}</p>
                    </div>
                  )
                }) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-sm text-slate-500">
                    No services yet. Create a category first, then add the first bookable service.
                  </div>
                )}
              </div>
            </article>

            <div className="grid gap-6">
              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Assigned team</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">{selectedService ? selectedService.name : 'Select a service'}</h2>
                <div className="mt-5 grid gap-2">
                  {assignedStaff.length ? assignedStaff.map((staffMember) => (
                    <div key={staffMember.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-sm font-semibold text-[#0B1C30]">{staffMember.displayName}</p>
                      <p className="mt-1 text-xs text-slate-500">{staffMember.roleTitle}</p>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                      No staff assigned yet. Use the staff workspace to connect people to this service.
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Availability preview</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">Bookable slots</h2>
                <div className="mt-5 grid gap-3">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Date
                    <input type="date" value={availabilityDate} onChange={(event) => setAvailabilityDate(event.target.value)} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Staff filter
                    <select value={availabilityStaffId} onChange={(event) => setAvailabilityStaffId(event.target.value)} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white">
                      <option value="ALL">All assigned staff</option>
                      {assignedStaff.map((staffMember) => (
                        <option key={staffMember.id} value={staffMember.id}>{staffMember.displayName}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="mt-5 space-y-2">
                  {!selectedService ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">Select a service from the catalog to preview its slots.</div>
                  ) : !availability?.slots.length ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">No bookable slots were generated for this date. Check staff assignments, shifts, and time off.</div>
                  ) : (
                    availability.slots.slice(0, 8).map((slot) => (
                      <div key={`${slot.staffMemberId}-${slot.startAt}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-[#0B1C30]">{slot.staffMemberDisplayName}</p>
                          <p className="mt-1 text-xs text-slate-500">{formatSlotTime(slot.startAt, availability.timezone)} - {formatSlotTime(slot.endAt, availability.timezone)}</p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{availability.durationMinutes} min</span>
                      </div>
                    ))
                  )}
                </div>
              </article>
            </div>
          </section>
        </div>
      )}
    </ManageBusinessShell>
  )
}

function ManageBusinessServicesPageFallback() {
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

export default function ManageBusinessServicesPage() {
  return (
    <Suspense fallback={<ManageBusinessServicesPageFallback />}>
      <ManageBusinessServicesPageContent />
    </Suspense>
  )
}

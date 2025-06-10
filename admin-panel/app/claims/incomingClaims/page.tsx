"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { toast } from "sonner";
import { claimsApi, type Claim } from "@/app/services/api";
import withAuth from "../../utils/withAuth";

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function IncomingClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClaims, setTotalClaims] = useState(0);

  // Debounced search term
  const debouncedSearch = useDebounce(search, 500);

  // Fetch claims data
  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await claimsApi.getClaims({
        search: debouncedSearch || undefined,
        page: currentPage,
        limit: 9, // 3x3 grid
      });

      // Ensure claims is always an array
      const claimsData = response.claims || [];
      
      setClaims(claimsData);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalClaims(response.pagination?.total || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch claims";
      setError(errorMessage);
      setClaims([]); // Set empty array on error
      setTotalPages(1);
      setTotalClaims(0);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch claims when search term or page changes
  useEffect(() => {
    fetchClaims();
  }, [debouncedSearch, currentPage]);

  // Reset to first page when search changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearch]);

  const getStatusColor = (status: Claim["status"]) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Needs More Info":
        return "bg-orange-100 text-orange-700";
      case "Forwarded":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Helper function to format dates safely
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Not specified";
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  // Helper function to format location safely
  const formatLocation = (location: string | object) => {
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location !== null) {
      // Try to extract meaningful location info from object
      const loc = location as Record<string, unknown>;
      if (typeof loc.name === 'string') return loc.name;
      if (typeof loc.city === 'string') return loc.city;
      if (typeof loc.address === 'string') return loc.address;
      return "Location specified";
    }
    return "Not specified";
  };

  const handleRetry = () => {
    fetchClaims();
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="rounded-2xl shadow-md">
          <CardContent className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-20 w-20 rounded-lg" />
                <Skeleton className="h-20 w-20 rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Incoming Claims</h1>
        <Button 
          variant="outline" 
          onClick={handleRetry}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {loading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            `${totalClaims} total claims`
          )}
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by claimant name or policy number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-red-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-800 font-medium">Failed to load claims</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
              <Button onClick={handleRetry} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Claims Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : !claims || claims.length === 0 ? (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No claims found</p>
            <p className="text-gray-500 text-sm mt-1">
              {search ? "Try adjusting your search criteria" : "No claims have been submitted yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {claims.map((claim) => (
            <Card key={claim.id} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{claim.claimantName}</h2>
                  <Badge className={getStatusColor(claim.status)}>
                    {claim.status}
                  </Badge>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Policy #:</span> {claim.policyNumber}</p>
                  <p><span className="font-medium">Vehicle:</span> {claim.vehicleInfo}</p>
                  <p><span className="font-medium">Accident:</span> {formatDate(claim.accidentDate)} at {formatLocation(claim.location)}</p>
                  <p><span className="font-medium">Driver:</span> {claim.driverName}</p>
                  <p><span className="font-medium">Submitted:</span> {formatDate(claim.dateSubmitted)}</p>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">Damage Evidence:</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {claim.damageImages && claim.damageImages.length > 0 ? (
                      claim.damageImages.slice(0, 3).map((src, i) => (
                        <div key={i} className="relative flex-shrink-0">
                          <Image
                            src={src}
                            alt={`Damage image ${i + 1}`}
                            width={80}
                            height={80}
                            className="rounded-lg border object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                          {claim.damageImages.length > 3 && i === 2 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                              +{claim.damageImages.length - 3}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500">No images uploaded</div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2 flex items-center gap-2 hover:bg-gray-50"
                  onClick={() => window.location.href = `/claims/incomingClaims/${claim.id}`}
                >
                  <Eye size={16} /> View Full Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-10 h-10"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default withAuth(IncomingClaimsPage);
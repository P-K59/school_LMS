"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { Bus, Plus, Search, X, MapPin, Navigation, UserCheck, RefreshCw } from "lucide-react";

export default function TransportMapPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);

  // Modals
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);

  // New Bus form
  const [busNumber, setBusNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  // New Route form
  const [routeName, setRouteName] = useState("");
  const [routeBusId, setRouteBusId] = useState("");

  // New Stop form
  const [stopName, setStopName] = useState("");
  const [stopRouteId, setStopRouteId] = useState("");

  // Allocation form
  const [allocStudentId, setAllocStudentId] = useState("");
  const [allocRouteId, setAllocRouteId] = useState("");
  const [allocStopId, setAllocStopId] = useState("");
  const [stopsForAllocRoute, setStopsForAllocRoute] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const busesRes = await api.get("/school-admin/transport/buses");
      const routesRes = await api.get("/school-admin/transport/routes");
      const studentsRes = await api.get("/school-admin/students");
      const allocsRes = await api.get("/school-admin/transport/allocations");

      setBuses(busesRes.data || []);
      setRoutes(routesRes.data || []);
      setStudents(studentsRes.data || []);
      setAllocations(allocsRes.data || []);

      if (busesRes.data && busesRes.data.length > 0) {
        setRouteBusId(busesRes.data[0].id);
      }
      if (routesRes.data && routesRes.data.length > 0) {
        setStopRouteId(routesRes.data[0].id);
        setAllocRouteId(routesRes.data[0].id);
        setStopsForAllocRoute(routesRes.data[0].stops || []);
        if (routesRes.data[0].stops && routesRes.data[0].stops.length > 0) {
          setAllocStopId(routesRes.data[0].stops[0].id);
        }
      }
      if (studentsRes.data && studentsRes.data.length > 0) {
        setAllocStudentId(studentsRes.data[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to retrieve transport registry.");
    } finally {
      setLoading(false);
    }
  };

  const handleRouteForAllocChange = (rId: string) => {
    setAllocRouteId(rId);
    const route = routes.find((r) => r.id === rId);
    const stopsList = route ? route.stops : [];
    setStopsForAllocRoute(stopsList);
    if (stopsList.length > 0) {
      setAllocStopId(stopsList[0].id);
    } else {
      setAllocStopId("");
    }
  };

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/school-admin/transport/buses", {
        busNumber,
        driverName,
        driverPhone,
      });
      setIsBusModalOpen(false);
      setBusNumber("");
      setDriverName("");
      setDriverPhone("");
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/school-admin/transport/routes", {
        name: routeName,
        busId: routeBusId || undefined,
      });
      setIsRouteModalOpen(false);
      setRouteName("");
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stopRouteId || !stopName) return;
    setSaving(true);
    try {
      await api.post("/school-admin/transport/stops", {
        routeId: stopRouteId,
        stopName,
      });
      setIsStopModalOpen(false);
      setStopName("");
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAllocateTransport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocStudentId || !allocRouteId || !allocStopId) return;
    setSaving(true);
    try {
      await api.post("/school-admin/transport/allocate", {
        studentId: allocStudentId,
        routeId: allocRouteId,
        stopId: allocStopId,
      });
      setIsAllocateModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-hanken font-bold text-4xl text-white tracking-tight flex items-center gap-3">
            <Bus className="text-indigo-500" /> Transport Map
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Register school buses, design transport routes, add geographic stops, and allocate student seating.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsBusModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-850 bg-slate-950 text-slate-350 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Bus size={14} /> Add Bus
          </button>
          <button
            onClick={() => setIsRouteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-850 bg-slate-950 text-slate-350 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Navigation size={14} /> Add Route
          </button>
          <button
            onClick={() => setIsStopModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-850 bg-slate-950 text-slate-350 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            <MapPin size={14} /> Add Stop
          </button>
          <button
            onClick={() => setIsAllocateModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
          >
            <UserCheck size={14} /> Allocate Seating
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-2xl text-rose-455 text-xs font-semibold">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Buses & Routes Registry */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Registered Routes */}
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4">Transit Routes & Stops</h3>
              {routes.length === 0 ? (
                <p className="text-slate-500 text-xs italic">No transport routes configured.</p>
              ) : (
                <div className="space-y-4">
                  {routes.map((r) => (
                    <div key={r.id} className="p-4 border border-slate-850 bg-slate-900/40 rounded-2xl">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                        <div>
                          <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                            <Navigation size={13} className="text-indigo-400" /> {r.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            Bus Number: {r.bus ? r.bus.busNumber : "No bus assigned"} (Driver: {r.bus?.driverName || "N/A"})
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Transit Stops</span>
                        <div className="flex flex-wrap gap-2">
                          {r.stops.length === 0 ? (
                            <span className="text-[10px] text-slate-600 font-medium italic">No stops added</span>
                          ) : (
                            r.stops.map((stop: any) => (
                              <span
                                key={stop.id}
                                className="bg-slate-800 border border-slate-750 text-slate-350 text-[10px] px-2 py-1 rounded-lg flex items-center gap-1"
                              >
                                <MapPin size={10} className="text-indigo-500" />
                                {stop.stopName}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fleet Buses */}
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4">Fleet Fleet Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {buses.length === 0 ? (
                  <p className="text-slate-500 text-xs italic col-span-2">No buses registered.</p>
                ) : (
                  buses.map((b) => (
                    <div key={b.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs space-y-1">
                      <p className="font-bold text-white">Bus Code: {b.busNumber}</p>
                      <p className="text-slate-400">Driver: {b.driverName}</p>
                      <p className="text-slate-500 font-geist">Contact: {b.driverPhone || "N/A"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Allocation Logs */}
          <div className="lg:col-span-1 p-6 bg-slate-950/60 border border-slate-800 rounded-3xl backdrop-blur-md space-y-4 h-fit">
            <h3 className="text-sm font-bold text-white">Seating Allocations</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {allocations.length === 0 ? (
                <p className="text-slate-550 text-xs italic">No transport seat assignments logged.</p>
              ) : (
                allocations.map((a) => (
                  <div key={a.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs space-y-1">
                    <p className="font-bold text-white">{a.student.firstName} {a.student.lastName}</p>
                    <p className="text-[10px] text-slate-500">Class: {a.student.class?.name}</p>
                    <p className="text-indigo-400 font-semibold flex items-center gap-1 mt-1 text-[10px]">
                      <Navigation size={10} /> Route: {a.route.name}
                    </p>
                    <p className="text-amber-400 font-semibold flex items-center gap-1 text-[10px]">
                      <MapPin size={10} /> Stop: {a.stop.stopName}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Bus Modal */}
      {isBusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white">Register Bus Profile</h3>
              <button
                onClick={() => setIsBusModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateBus} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bus Number / License</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH-12-PQ-9021"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Driver Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Driver Mobile Contact</label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsBusModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Register Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Route Modal */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white">Create Transit Route</h3>
              <button
                onClick={() => setIsRouteModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateRoute} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Route Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector-7 Central Route"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assign Fleet Bus</label>
                <select
                  value={routeBusId}
                  onChange={(e) => setRouteBusId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- No Bus --</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.busNumber} (Driver: {b.driverName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Create Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stop Modal */}
      {isStopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white">Create Geographic Stop</h3>
              <button
                onClick={() => setIsStopModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateStop} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Route</label>
                <select
                  value={stopRouteId}
                  onChange={(e) => setStopRouteId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Stop Name / Landmark</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector-7 Shopping Mall Gate"
                  value={stopName}
                  onChange={(e) => setStopName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsStopModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || routes.length === 0}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Publish Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Seating Modal */}
      {isAllocateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white">Allocate Transport Seats</h3>
              <button
                onClick={() => setIsAllocateModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAllocateTransport} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Student</label>
                <select
                  value={allocStudentId}
                  onChange={(e) => setAllocStudentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} (Roll: {s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Route</label>
                <select
                  value={allocRouteId}
                  onChange={(e) => handleRouteForAllocChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Stops: {r.stops.length})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Transit Stop</label>
                <select
                  value={allocStopId}
                  onChange={(e) => setAllocStopId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {stopsForAllocRoute.length === 0 ? (
                    <option value="">-- No Stops on this Route --</option>
                  ) : (
                    stopsForAllocRoute.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.stopName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || students.length === 0 || routes.length === 0 || stopsForAllocRoute.length === 0}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Assign Transit seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiSearch, FiLoader } from "react-icons/fi";
import { TbTemperatureCelsius, TbTemperatureFahrenheit } from "react-icons/tb";
import { IoSunnyOutline, IoCloudOutline, IoRainyOutline } from "react-icons/io5";
import { api } from "../utils/api";

export default function Dashboard() {
    // Đơn vị nhiệt độ ("m" = Celsius, "f" = Fahrenheit)
    const [units, setUnits] = useState("m");
    // Nhập liệu tìm kiếm
    const [locationInput, setLocationInput] = useState("");
    // Trạng thái tìm kiếm/loading
    const [isSearching, setIsSearching] = useState(true); // Bắt đầu với true để load lần đầu
    // Dữ liệu hiện tại
    const [currentData, setCurrentData] = useState(null);
    // Dữ liệu dự báo
    const [forecastData, setForecastData] = useState(null);
    // State để track lỗi
    const [error, setError] = useState(null);

    // Trigger để reload current data
    const [currentDataTrigger, setCurrentDataTrigger] = useState({
        location: "", // empty string cho lần đầu load
        units: "m"
    });

    // Fetch current data
    useEffect(() => {
        let cancelled = false;

        const fetchCurrentData = async () => {
            setIsSearching(true);
            setError(null); // Reset lỗi mỗi lần fetch

            const formData = new FormData();
            formData.append('location', currentDataTrigger.location);
            formData.append('units', currentDataTrigger.units);

            try {
                const res = await api.post("/getCurrentData", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                if (cancelled) return;

                if (res.success) {
                    // API thành công
                    const data = res.data.data;
                    setCurrentData(data);

                    if (currentDataTrigger.location) {
                        toast.success("Tìm kiếm thành công!");
                        setLocationInput("");
                    }
                } else {
                    // API trả về lỗi
                    toast.error(res.error || "Lỗi tải dữ liệu");
                    setError(res.error || "Không tìm thấy địa điểm");

                    // SỬA: Nếu tìm kiếm lỗi, quay về trạng thái ban đầu
                    if (currentDataTrigger.location !== "") {
                        setLocationInput("");
                        setCurrentDataTrigger(prev => ({ ...prev, location: "" }));
                    } else {
                        // Lỗi ngay lần load đầu
                        setCurrentData(null);
                        setForecastData(null);
                    }
                }
            } catch (e) {
                if (cancelled) return;
                const errorMessage = "Lỗi kết nối hoặc server không phản hồi.";
                toast.error(errorMessage);
                setError(errorMessage);
                setCurrentData(null);
                setForecastData(null);
                setLocationInput("");
            } finally {
                if (!cancelled) {
                    setIsSearching(false);
                }
            }
        };

        fetchCurrentData();

        return () => {
            cancelled = true;
        };
    }, [currentDataTrigger]);

    // Fetch forecast data khi có currentData
    useEffect(() => {
        if (!currentData?.location?.lat || !currentData?.location?.lon) {
            setForecastData(null);
            return;
        }

        let cancelled = false;

        const fetchForecastData = async () => {
            try {
                const formData = new FormData();
                formData.append('lat', currentData.location.lat.toString());
                formData.append('long', currentData.location.lon.toString());
                formData.append('units', units);

                const res = await api.post("/getForecastData", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                if (cancelled) return;

                if (res.success) {
                    setForecastData(res.data.data);
                } else {
                    toast.error(res.error || "Lỗi tải dự báo");
                    setError(res.error || "Lỗi tải dự báo");

                    // Reset về trạng thái ban đầu
                    setCurrentData(null);
                    setForecastData(null);
                    setLocationInput("");
                    setCurrentDataTrigger({
                        location: "",
                        units: units
                    });
                }
            } catch (e) {
                if (cancelled) return;
                const errorMessage = "Lỗi kết nối khi tải dự báo";
                toast.error(errorMessage);
                setError(errorMessage);

                setCurrentData(null);
                setForecastData(null);
                setLocationInput("");
                setCurrentDataTrigger({
                    location: "",
                    units: units
                });
            }
        };

        fetchForecastData();

        return () => {
            cancelled = true;
        };
    }, [currentData?.location?.lat, currentData?.location?.lon, units]);

    {/*----------------------------------------------------------------------------------------------------------------------------------- */ }
    // Handle search
    const handleSearch = () => {
        if (!locationInput) {
            toast.error("Vui lòng nhập tên thành phố");
            return;
        }

        setCurrentDataTrigger({
            location: locationInput,
            units: units
        });
    };

    //Suggestion search
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const citySuggestions = [
        // Việt Nam
        "Hà Nội, Việt Nam",
        "Huế, Việt Nam",
        "Quảng Ninh, Việt Nam",
        "Cao Bằng, Việt Nam",
        "Nghệ An, Việt Nam",
        "Lai Châu, Việt Nam",
        "Sơn La, Việt Nam",
        "Thanh Hóa, Việt Nam",
        "Hồ Chí Minh, Việt Nam",
        "Đồng Nai, Việt Nam",
        "Đà Nẵng, Việt Nam",
        "Hà Giang, Việt Nam",
        "Tuyên Quang, Việt Nam",
        "Lào Cai, Việt Nam",
        "Yên Bái, Việt Nam",
        "Thái Nguyên, Việt Nam",
        "Bắc Kạn, Việt Nam",
        "Hòa Bình, Việt Nam",
        "Vĩnh Phúc, Việt Nam",
        "Phú Thọ, Việt Nam",
        "Bắc Ninh, Việt Nam",
        "Bắc Giang, Việt Nam",
        "Hưng Yên, Việt Nam",
        "Thái Bình, Việt Nam",
        "Hải Phòng, Việt Nam",
        "Hải Dương, Việt Nam",
        "Hà Nam, Việt Nam",
        "Nam Định, Việt Nam",
        "Ninh Bình, Việt Nam",
        "Quảng Bình, Việt Nam",
        "Quảng Trị, Việt Nam",
        "Quảng Nam, Việt Nam",
        "Kon Tum, Việt Nam",
        "Quảng Ngãi, Việt Nam",
        "Gia Lai, Việt Nam",
        "Bình Định, Việt Nam",
        "Ninh Thuận, Việt Nam",
        "Khánh Hòa, Việt Nam",
        "Đắk Nông, Việt Nam",
        "Bình Thuận, Việt Nam",
        "Lâm Đồng, Việt Nam",
        "Phú Yên, Việt Nam",
        "Đắk Lắk, Việt Nam",
        "Bà Rịa - Vũng Tàu, Việt Nam",
        "Bình Dương, Việt Nam",
        "Thành phố Hồ Chí Minh, Việt Nam",
        "Bình Phước, Việt Nam",
        "Tây Ninh, Việt Nam",
        "Long An, Việt Nam",
        "Sóc Trăng, Việt Nam",
        "Hậu Giang, Việt Nam",
        "Cần Thơ, Việt Nam",
        "Bến Tre, Việt Nam",
        "Vĩnh Long, Việt Nam",
        "Trà Vinh, Việt Nam",
        "Tiền Giang, Việt Nam",
        "Đồng Tháp, Việt Nam",
        "Bạc Liêu, Việt Nam",
        "Cà Mau, Việt Nam",
        "Kiên Giang, Việt Nam",
        "An Giang, Việt Nam",

        // Mỹ & Canada
        "New York, United States",
        "Los Angeles, United States",
        "Chicago, United States",
        "San Francisco, United States",
        "Miami, United States",
        "Toronto, Canada",
        "Vancouver, Canada",

        // Châu Mỹ Latinh
        "Mexico City, Mexico",
        "São Paulo, Brazil",
        "Rio de Janeiro, Brazil",
        "Buenos Aires, Argentina",

        // Châu Âu
        "London, United Kingdom",
        "Paris, France",
        "Berlin, Germany",
        "Munich, Germany",
        "Rome, Italy",
        "Milan, Italy",
        "Madrid, Spain",
        "Barcelona, Spain",
        "Amsterdam, Netherlands",
        "Vienna, Austria",
        "Zurich, Switzerland",
        "Stockholm, Sweden",
        "Copenhagen, Denmark",
        "Oslo, Norway",
        "Helsinki, Finland",
        "Warsaw, Poland",
        "Prague, Czech Republic",
        "Budapest, Hungary",
        "Athens, Greece",
        "Istanbul, Turkey",
        "Moscow, Russia",
        "Saint Petersburg, Russia",

        // Châu Á
        "Tokyo, Japan",
        "Osaka, Japan",
        "Seoul, South Korea",
        "Beijing, China",
        "Shanghai, China",
        "Hong Kong, China",
        "Singapore, Singapore",
        "Bangkok, Thailand",
        "Kuala Lumpur, Malaysia",
        "Jakarta, Indonesia",
        "Manila, Philippines",
        "Mumbai, India",
        "New Delhi, India",
        "Bangalore, India",

        // Trung Đông
        "Dubai, United Arab Emirates",
        "Abu Dhabi, United Arab Emirates",
        "Riyadh, Saudi Arabia",
        "Tel Aviv, Israel",
        "Jerusalem, Israel",
        "Mecca, Saudi Arabia",

        // Châu Phi
        "Cairo, Egypt",
        "Cape Town, South Africa",
        "Johannesburg, South Africa",
        "Lagos, Nigeria",
        "Nairobi, Kenya",
        "Casablanca, Morocco",
        "Tunis, Tunisia",

        // Châu Đại Dương
        "Sydney, Australia",
        "Melbourne, Australia",
        "Brisbane, Australia",
        "Auckland, New Zealand",
        "Wellington, New Zealand",

        // Các quốc gia/thành phố đặc biệt
        "Vatican City, Vatican City",
        "Monaco, Monaco"
    ];

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocationInput(value);

        if (value.length > 0) {
            const filtered = citySuggestions.filter(city =>
                city.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 8); // Giới hạn 8 gợi ý

            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            setFilteredSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setLocationInput(suggestion);
        setShowSuggestions(false);
        setFilteredSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowSuggestions(false);
        } else if (e.key === 'Enter') {
            setShowSuggestions(false);
            handleSearch();
        }
    };
    {/*----------------------------------------------------------------------------------------------------------------------------------- */ }
    // Handle units change
    const handleUnitsChange = (newUnits) => {
        setUnits(newUnits);

        setCurrentDataTrigger(prev => ({
            ...prev,
            units: newUnits
        }));
    };

    // Xác định icon thời tiết hiện tại
    const CurrentBgIcon = useMemo(() => {
        if (!currentData?.current?.weather_descriptions?.[0]) return IoSunnyOutline;
        const desc = currentData.current.weather_descriptions[0].toLowerCase();
        if (desc.includes("rain")) return IoRainyOutline;
        if (desc.includes("cloud")) return IoCloudOutline;
        return IoSunnyOutline;
    }, [currentData?.current?.weather_descriptions]);

    const tempUnitLabel = units === "f" ? "°F" : "°C";
    const hourlyItems = forecastData?.list || [];

    // Gom dự báo theo ngày
    const groupedByDay = useMemo(() => {
        const groups = {};
        hourlyItems.forEach((item) => {
            const date = item.dt_txt.split(" ")[0];
            if (!groups[date]) groups[date] = [];
            groups[date].push(item);
        });
        return groups;
    }, [hourlyItems]);

    const firstThreeDays = useMemo(() => Object.keys(groupedByDay).slice(0, 3), [groupedByDay]);

    // Icon emoji cho các slot
    const iconEmoji = (code = "01d") => {
        const iconMap = {
            "01": "☀️", "02": "🌤️", "03": "☁️", "04": "☁️",
            "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️"
        };
        return iconMap[code.substring(0, 2)] || "🌤️";
    };

    {/*----------------------------------------------------------------------------------------------------------------------------------- */ }

    //Logic cuộn thanh ngang ở forecast data
    const scrollRefs = useRef({});

    const handleScroll = (dayKey, direction) => {
        const container = scrollRefs.current[dayKey];
        if (!container) return;

        const scrollAmount = 250; // Khoảng cách scroll mỗi lần
        const currentScroll = container.scrollLeft;

        if (direction === 'left') {
            container.scrollTo({
                left: currentScroll - scrollAmount,
                behavior: 'smooth'
            });
        } else {
            container.scrollTo({
                left: currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    {/*----------------------------------------------------------------------------------------------------------------------------------- */ }

    // Logic hiển thị Loading / Error / Content
    if (isSearching && !currentData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="inline-flex items-center gap-2 text-slate-600">
                    <FiLoader className="animate-spin text-xl" />
                    {currentDataTrigger.location ? "Đang tìm kiếm..." : "Đang tải dữ liệu..."}
                </span>
            </div>
        );
    }

    {/*----------------------------------------------------------------------------------------------------------------------------------- */ }

    if (error && !currentData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <span className="text-slate-600 mb-4 text-center">
                    {error}<br />Không thể tải dữ liệu thời tiết ban đầu.
                </span>
                <button
                    className="mt-4 px-5 py-3 rounded-xl text-white font-medium shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600"
                    onClick={() => {
                        setError(null);
                        setCurrentDataTrigger({ location: "", units: units });
                    }}
                >
                    Thử lại
                </button>
            </div>
        );
    }

    // Nếu không có currentData và không đang loading/error
    if (!currentData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <span className="text-slate-600 mb-4">Đã có lỗi xảy ra khi tải dữ liệu.</span>
                <button
                    className="px-5 py-3 rounded-xl text-white font-medium shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600"
                    onClick={() => setCurrentDataTrigger({ location: "", units: units })}
                >
                    Tải lại
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-[linear-gradient(135deg,#e0f2fe_0%,#eef2ff_100%)]">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="text-center mb-6 relative">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Weather Dashboard</h1>
                        <p className="text-slate-600">Realtime weather forecast app</p>
                    </div>

                    {/* Button với absolute positioning */}
                    <button
                        className="absolute top-0 right-0 px-5 py-3 rounded-xl text-white font-medium shadow-lg transition-all
                bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700
                flex flex-row items-center disabled:opacity-70">
                        Đăng nhập/Đăng ký
                    </button>
                </div>


                {/* Search Bar */}
                <div className="rounded-2xl border border-white/40 bg-white/60 backdrop-blur-md shadow-xl p-4 md:p-5 mb-6 relative z-20">

                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch">
                        <div className="flex-1 relative">
                            <div className="flex items-center gap-3 rounded-xl bg-white/80 border border-blue-200 px-4 py-3">
                                <FiSearch className="text-slate-500 text-lg shrink-0" />
                                <input
                                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                                    placeholder="Nhập tên thành phố, ví dụ: Hà Nội, Việt Nam"
                                    value={locationInput}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    onBlur={() => {
                                        setTimeout(() => setShowSuggestions(false), 150);
                                    }}
                                    onFocus={() => {
                                        if (locationInput && filteredSuggestions.length > 0) {
                                            setShowSuggestions(true);
                                        }
                                    }}
                                />
                            </div>

                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-xl border border-gray-200 shadow-lg max-h-64 overflow-y-auto">
                                    {filteredSuggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <FiSearch className="text-gray-400 text-sm flex-shrink-0" />
                                            <span className="text-gray-700 text-sm">{suggestion}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                disabled={isSearching || !locationInput}
                                className="px-5 py-3 rounded-xl text-white font-medium shadow-lg transition-all
                                bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700
                                flex flex-row items-center disabled:opacity-70 disabled:cursor-not-allowed"
                                onClick={handleSearch}
                            >
                                Tìm kiếm
                                {isSearching && <FiLoader className="animate-spin text-base ml-3" />}
                            </button>
                            <div className="relative">
                                <select
                                    className="px-4 py-3 rounded-xl bg-white/80 border border-blue-200 text-slate-700
                        focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={units}
                                    onChange={(e) => handleUnitsChange(e.target.value)}
                                >
                                    <option value="m">Metric (°C)</option>
                                    <option value="f">Fahrenheit (°F)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Weather Card */}
                <div className="rounded-2xl border border-white/40 bg-white/60 backdrop-blur-md shadow-xl p-6 md:p-8 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
                        <div className="flex-1 min-w-0">
                            {/* Location + time */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                                    {currentData.location.name}, {currentData.location.country}
                                </span>
                                <span className="text-slate-500 text-sm">{currentData.location.localtime}</span>
                                <span className="text-slate-400 text-xs">
                                    TZ: {currentData.location.timezone_id} (UTC{currentData.location.utc_offset})
                                </span>
                            </div>

                            {/* Headline */}
                            <div className="flex flex-col lg:flex-row gap-2 items-start">
                                {/* LEFT */}
                                <div className="flex-1 min-w-0 max-w-1/3 flex items-center gap-4">
                                    {currentData?.current?.weather_icons?.[0] && (
                                        <img
                                            src={currentData.current.weather_icons[0]}
                                            alt="icon"
                                            className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0"
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-none tracking-tight">
                                            {Math.round(currentData?.current?.temperature ?? 0)}
                                            {tempUnitLabel}
                                        </div>
                                        <div className="mt-1 text-slate-600 text-base md:text-lg capitalize truncate">
                                            {currentData?.current?.weather_descriptions?.[0] ?? "N/A"}
                                        </div>
                                    </div>
                                </div>
                                {/* RIGHT: 2 cards */}
                                <div className="w-full lg:w-150 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Card 1 */}
                                    <div className="w-full rounded-2xl bg-white/60 border border-white/40 p-4 shadow">
                                        <div className="mb-3">
                                            <div className="text-slate-900 font-semibold text-lg">{currentData?.location?.name}</div>
                                            <div className="text-slate-500 text-xs">
                                                Lat/Lon: {currentData?.location?.lat}, {currentData?.location?.lon}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="rounded-2xl bg-gradient-to-br from-yellow-100 to-blue-50 p-3 flex-shrink-0">
                                                {(() => {
                                                    const Icon = CurrentBgIcon;
                                                    return <Icon className="text-3xl text-amber-500" />;
                                                })()}
                                            </div>
                                            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-slate-400">Mặt trời mọc:</span>
                                                    <span className="font-medium text-slate-700">{currentData?.current?.astro?.sunrise ?? "—"}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-slate-400">Mặt trời lặn:</span>
                                                    <span className="font-medium text-slate-700">{currentData?.current?.astro?.sunset ?? "—"}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-slate-400">UV:</span>
                                                    <span className="font-medium text-slate-700">{currentData?.current?.uv_index ?? "—"}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-slate-400">Tầm nhìn:</span>
                                                    <span className="font-medium text-slate-700">{currentData?.current?.visibility ?? "—"} km</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Card 2 */}
                                    <div className="w-full rounded-2xl bg-white/60 border border-white/40 p-4 shadow">
                                        <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                                            <div>
                                                Feels like{" "}
                                                <span className="font-semibold text-slate-800">
                                                    {currentData?.current?.feelslike ?? "—"}
                                                    {tempUnitLabel}
                                                </span>
                                            </div>
                                            <div>
                                                Hướng gió: <span className="font-medium">{currentData?.current?.wind_dir ?? "—"}</span> - Góc:{" "}
                                                <span className="font-medium">{currentData?.current?.wind_degree ?? "—"}&deg;</span>
                                            </div>
                                            <div>
                                                Air Quality (PM2.5):{" "}
                                                <span className="font-medium">{currentData?.current?.air_quality?.["pm2_5"] ?? "—"}</span> - PM10:{" "}
                                                <span className="font-medium">{currentData?.current?.air_quality?.["pm10"] ?? "—"}</span>
                                            </div>
                                            <div>
                                                EPA: <span className="font-medium">{currentData?.current?.air_quality?.["us-epa-index"] ?? "—"}</span>{" "}
                                                - DEFRA: <span className="font-medium">{currentData?.current?.air_quality?.["gb-defra-index"] ?? "—"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Quick metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                                <div className="rounded-xl bg-white/70 border border-white/40 p-4 text-center">
                                    <div className="text-xs text-slate-500 mb-1">Gió</div>
                                    <div className="text-2xl font-bold text-slate-800">
                                        {currentData.current.wind_speed} {units === "m" ? "km/h" : "miles/h"}
                                    </div>
                                    <div className="text-xs text-slate-500">Hướng: {currentData.current.wind_dir}</div>
                                </div>
                                <div className="rounded-xl bg-white/70 border border-white/40 p-4 text-center">
                                    <div className="text-xs text-slate-500 mb-1">Độ ẩm</div>
                                    <div className="text-2xl font-bold text-slate-800">{currentData.current.humidity}%</div>
                                    <div className="text-xs text-slate-500">Áp suất: {currentData.current.pressure} MB - Milibar</div>
                                </div>
                                <div className="rounded-xl bg-white/70 border border-white/40 p-4 text-center">
                                    <div className="text-xs text-slate-500 mb-1">Lượng mây</div>
                                    <div className="text-2xl font-bold text-slate-800">{currentData.current.cloudcover}%</div>
                                    <div className="text-xs text-slate-500">
                                        Lượng mưa: {currentData.current.precip} {units === "m" ? "mm" : "inch"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Forecast 3 ngày - Chỉ hiển thị khi có forecastData */}
                {forecastData && (
                    <>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800">Dự báo 3 ngày (mỗi 3 giờ)</h2>
                            <div className="text-slate-500 text-sm">
                                Thành phố: <span className="font-medium">{forecastData.city.name}</span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {firstThreeDays.map((dayKey) => (
                                <div key={dayKey} className="rounded-2xl border border-white/40 bg-white/60 backdrop-blur-md shadow-xl p-4">
                                    {/* Day header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">{dayKey}</span>
                                            <span className="text-slate-500 text-sm">{groupedByDay[dayKey]?.length || 0} mốc dự báo</span>
                                        </div>
                                        <div className="hidden md:flex items-center gap-2 text-slate-500">
                                            <button
                                                className="p-2 rounded-full bg-white/70 border border-white/40 hover:bg-white shadow"
                                                onClick={() => handleScroll(dayKey, 'left')}
                                            >
                                                ‹
                                            </button>
                                            <button
                                                className="p-2 rounded-full bg-white/70 border border-white/40 hover:bg-white shadow"
                                                onClick={() => handleScroll(dayKey, 'right')}
                                            >
                                                ›
                                            </button>
                                        </div>
                                    </div>

                                    {/* Horizontal scroll list */}
                                    <div
                                        ref={(el) => {
                                            if (el) {
                                                scrollRefs.current[dayKey] = el;
                                            }
                                        }}
                                        className="flex gap-3 overflow-x-auto scroll-smooth pr-1 hide-scrollbar"
                                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                    >
                                        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                                        {groupedByDay[dayKey]?.map((slot) => {
                                            const timeLabel = slot.dt_txt.split(" ")[1]?.slice(0, 5) || "--:--";
                                            const emoji = iconEmoji(slot.weather?.[0]?.icon || "01d");
                                            return (
                                                <div
                                                    key={slot.dt}
                                                    className="min-w-[190px] flex-shrink-0 rounded-xl bg-white/70 border border-white/40 p-4 shadow hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
                                                >
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-slate-600">{timeLabel}</span>
                                                        <span className="text-base">{emoji}</span>
                                                    </div>
                                                    <div className="text-2xl font-bold text-slate-800">
                                                        {Math.round(slot.main.temp)}
                                                        {tempUnitLabel}
                                                    </div>
                                                    <div className="text-xs text-slate-500 capitalize truncate">{slot.weather?.[0]?.description || "—"}</div>
                                                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                                                        <div className="rounded-lg bg-white/80 border border-white/50 p-2">
                                                            <div className="text-[10px] text-slate-500">Độ ẩm</div>
                                                            <div className="text-sm font-semibold text-slate-700">{slot.main.humidity}%</div>
                                                        </div>
                                                        <div className="rounded-lg bg-white/80 border border-white/50 p-2">
                                                            <div className="text-[10px] text-slate-500">Gió</div>
                                                            <div className="text-sm font-semibold text-slate-700">{Math.round(slot.wind.speed)} m/s</div>
                                                        </div>
                                                        <div className="rounded-lg bg-white/80 border border-white/50 p-2">
                                                            <div className="text-[10px] text-slate-500">Mưa</div>
                                                            <div className="text-sm font-semibold text-slate-700">{Math.round((slot.pop || 0) * 100)}%</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

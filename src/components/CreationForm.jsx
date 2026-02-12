"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Upload, X, Heart, Sparkles, Wand2, Lock, Copy } from "lucide-react"
import Link from "next/link"

export default function CreationForm() {
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState("form") // form, success
    const [uploading, setUploading] = useState(false)

    // Form Data
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [files, setFiles] = useState([])

    const [createdId, setCreatedId] = useState(null)
    const [previewCount, setPreviewCount] = useState(0)
    const [isPaid, setIsPaid] = useState(false)

    useEffect(() => {
        // Check local storage for created Valentine
        const savedId = localStorage.getItem("valentine_created_id")
        if (savedId) {
            setCreatedId(savedId)
            setView("success")
            // Fetch payment status
            supabase.from("valentines").select("payment_status").eq("id", savedId).single()
                .then(({ data }) => {
                    if (data?.payment_status === "paid") setIsPaid(true)
                })
        } else {
            setView("form")
        }

        // Check preview count
        const savedCount = localStorage.getItem("valentine_preview_count")
        if (savedCount) setPreviewCount(parseInt(savedCount))

        setLoading(false)
    }, [])

    const handlePreview = () => {
        const newCount = previewCount + 1
        setPreviewCount(newCount)
        localStorage.setItem("valentine_preview_count", newCount.toString())
        window.open(`/love/${createdId}`, '_blank')
    }

    const handlePayment = async () => {
        const res = await fetch("/api/create-order", { method: "POST" });
        const data = await res.json();

        if (!data.id) {
            alert("Razorpay payment failed to initiate.");
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "Valentine Confession",
            description: "Unlock your special message",
            order_id: data.id,
            handler: async function (response) {
                // Verify Payment
                const verifyRes = await fetch("/api/verify-payment", {
                    method: "POST",
                    body: JSON.stringify({
                        orderCreationId: data.id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                        valentineId: createdId // Use the ID of the created valentine
                    }),
                });

                const verifyData = await verifyRes.json();

                if (verifyData.isOk) {
                    alert("Payment Successful! Your page is unlocked forever. 🎉");
                    setIsPaid(true);
                } else {
                    alert("Payment Verification Failed.");
                }
            },
            prefill: {
                name: "Your Name",
                email: "youremail@example.com",
            },
            theme: {
                color: "#ec4899",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
            setFiles(prev => [...prev, ...newFiles])
        }
    }



    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (files.length < 6) {
            alert("⚠️ Please upload at least 6 photos!")
            return
        }
        setUploading(true)

        try {
            const urls = []
            for (const f of files) {
                const path = `${Date.now()}_${f.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

                // Get signed URL
                const signRes = await fetch('/api/sign-upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path }),
                })
                const signData = await signRes.json()
                if (!signRes.ok) throw new Error(signData.error || 'Failed to sign upload')

                // Upload to signed URL using the token
                const { error: uploadError } = await supabase.storage
                    .from('photos')
                    .uploadToSignedUrl(path, signData.token, f)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path)
                urls.push(publicUrl)
            }

            let musicUrl = null


            // Call API to create valentine
            const res = await fetch('/api/create-valentine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partner_name: name, message: message, photos: urls, music_url: musicUrl }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create valentine')
            }

            setCreatedId(data.id)
            localStorage.setItem("valentine_created_id", data.id)
            setView("success")
        } catch (error) {
            console.error(error)
            alert("Error: " + error.message)
        } finally {
            setUploading(false)
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-pink-500"><Heart className="animate-bounce" /></div>

    const demoLink = "/demo"

    return (
        <div className="min-h-screen bg-pink-50 text-gray-800 font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">

                {/* Form Screen */}
                {view === "form" && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-pink-500">
                        <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Share Your Secrets 🤫</h1>
                                <p className="text-gray-500 text-sm mt-1">Fill out this form to create your valentine page.</p>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex items-start gap-3">
                                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Note:</strong> Your data is saved securely to the cloud! ☁️<br />
                                    (See <a href={demoLink} target="_blank" className="underline font-medium hover:text-blue-900">Example Website</a>)
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-2">Partner Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                        placeholder="Who is this For ?"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-2">Custom Message <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none min-h-[120px]"
                                        placeholder="Write your heartfelt message here..."
                                        required
                                    />
                                </div>



                                <div>
                                    <label className="block text-lg font-medium text-gray-800 mb-2">Upload 6+ Photos <span className="text-red-500">*</span></label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-600 font-medium">Click to upload photos</p>
                                        <p className="text-gray-400 text-sm">or drag and drop here</p>
                                    </div>

                                    {/* File List */}
                                    {files.length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
                                            {files.map((file, i) => (
                                                <div key={i} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(i)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p className={`mt-2 text-sm font-medium ${files.length >= 6 ? 'text-green-600' : 'text-red-500'}`}>
                                        Total Photos: {files.length} {files.length < 6 && "(Minimum 6 required)"}
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={uploading || files.length < 6}
                                        className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {uploading ? "Uploading... ⏳" : "Create Valentine Page 🚀"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Success Screen */}
                {view === "success" && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center p-12 border-t-8 border-green-500">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 fill-current" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Valentine Created! 🎉</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">Your special page is ready. You can now preview it or share the link with your loved one.</p>

                        <div className="flex flex-col gap-4 max-w-sm mx-auto">
                            {previewCount < 3 && !isPaid ? (
                                <button onClick={handlePreview} className="bg-pink-500 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:bg-pink-600 transition flex items-center justify-center gap-2">
                                    <Wand2 className="w-5 h-5" />
                                    Preview Page ({3 - previewCount} left)
                                </button>
                            ) : !isPaid && (
                                <div className="bg-red-50 text-red-500 font-bold p-3 rounded-lg border border-red-100 animate-pulse">
                                    Preview Limit Reached 🔒
                                </div>
                            )}

                            {isPaid ? (
                                <div className="bg-green-50 p-4 rounded-xl border border-green-200 space-y-3">
                                    <h3 className="text-lg font-bold text-green-700 flex items-center justify-center gap-2">
                                        Unlocked Forever! 🔓
                                    </h3>
                                    <div className="flex gap-2">
                                        <input
                                            readOnly
                                            value={`${window.location.origin}/love/${createdId}`}
                                            className="flex-1 p-2 text-sm border border-green-300 rounded-lg bg-white text-gray-600 outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/love/${createdId}`)
                                                alert("Link Copied! 📋")
                                            }}
                                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
                                        >
                                            <Copy className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button disabled className="w-full bg-gray-400 text-white py-3 px-6 rounded-xl font-bold shadow-none cursor-not-allowed flex items-center justify-center gap-2">
                                        Payment Done ✅
                                    </button>
                                </div>
                            ) : (
                                <button onClick={handlePayment} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2 transform hover:scale-105">
                                    <Lock className="w-5 h-5" />
                                    Pay ₹49 to Unlock Forever
                                </button>
                            )}

                            <div className="flex justify-between gap-4 mt-2">
                                <button onClick={() => setView("form")} className="flex-1 text-pink-600 hover:text-pink-700 bg-pink-50 py-2 rounded-lg text-sm font-medium border border-pink-100">
                                    Edit / Reuse Details
                                </button>
                                <button onClick={() => {
                                    localStorage.removeItem("valentine_created_id");
                                    localStorage.removeItem("valentine_preview_count");
                                    setPreviewCount(0);
                                    setIsPaid(false);
                                    setView("form");
                                    setFiles([]);

                                    setMessage("");
                                    setName("");
                                }} className="flex-1 text-gray-500 hover:text-gray-700 underline text-sm">
                                    Create New
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

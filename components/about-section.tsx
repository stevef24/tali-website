"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { EASE_LUXURY } from "@/lib/animations";
import { getBlurDataUrl } from "@/lib/utils/image-paths";

export function AboutSection() {
	const { t } = useLanguage();

	return (
		<section id="about" className="px-6 py-24 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<motion.h2
					initial={{ opacity: 0, filter: "blur(20px)" }}
					whileInView={{ opacity: 1, filter: "blur(0px)" }}
					viewport={{ once: true }}
					transition={{ duration: 1.0, ease: EASE_LUXURY }}
					className="mb-16 font-serif text-3xl tracking-tight md:text-4xl"
				>
					{t.about.title}
				</motion.h2>
				<div className="grid gap-12 md:grid-cols-5 md:gap-16">
					<motion.div
						initial={{ opacity: 0, filter: "blur(30px)", scale: 0.92 }}
						whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 1.2, ease: EASE_LUXURY }}
						className="md:col-span-2 flex flex-col justify-center h-[300px] md:h-auto"
					>
						<motion.div
							className="relative flex-1 bg-muted overflow-hidden rounded-sm"
						>
							<Image
								src="https://res.cloudinary.com/dcmflt2on/image/upload/v1766090020/tali-portfolio/tali-photo.png"
								alt="Portrait of Tali Assa"
								fill
								sizes="(min-width: 768px) 40vw, 100vw"
								placeholder="blur"
								blurDataURL={getBlurDataUrl()}
								className="object-cover object-center bg-none"
							/>
						</motion.div>
					</motion.div>
					<div className="flex flex-col justify-center md:col-span-3">
						<div className="space-y-6 font-sans text-base leading-relaxed text-foreground/80 md:text-lg">
							{t.about.bio.map((paragraph, index) => (
								<motion.p
									key={index}
									initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
									whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
									viewport={{ once: true, amount: 0.3 }}
									transition={{
										delay: index * 0.12,
										duration: 0.8,
										ease: EASE_LUXURY,
									}}
								>
									{paragraph}
								</motion.p>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

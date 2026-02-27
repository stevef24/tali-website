"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { EASE_LUXURY } from "@/lib/animations";
import { getBlurDataUrl } from "@/lib/utils/image-paths";

export function AboutSection() {
	const { t } = useLanguage();

	return (
		<section id="about" className="px-6 py-6 md:py-24 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<motion.h2
					initial={{ opacity: 0, filter: "blur(20px)" }}
					whileInView={{ opacity: 1, filter: "blur(0px)" }}
					viewport={{ once: true }}
					transition={{ duration: 1.0, ease: EASE_LUXURY }}
					className="mb-4 md:mb-16 font-serif text-fluid-3xl tracking-tight"
				>
					{t.about.title}
				</motion.h2>
				<div className="grid gap-12 md:grid-cols-5 md:gap-16">
					<motion.div
						initial={{ opacity: 0, filter: "blur(30px)", scale: 0.92 }}
						whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 1.2, ease: EASE_LUXURY }}
						className="md:col-span-2 flex items-center"
					>
						<Image
							src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto,w_800/v1772211799/tali-portfolio/tali-photo.jpg`}
							alt="Portrait of Tali Assa"
							width={700}
							height={662}
							sizes="(min-width: 768px) 40vw, 100vw"
							placeholder="blur"
							blurDataURL={getBlurDataUrl()}
							className="w-full h-auto"
						/>
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

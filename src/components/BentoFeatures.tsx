import React from 'react';
import { motion } from 'motion/react';
import { Award, Footprints, ShieldCheck, Wrench } from 'lucide-react';

export const BentoFeatures: React.FC = () => {
  return (
    <motion.section
      id="features"
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-[#E4EDFE] py-20 px-4 md:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-white border border-emerald-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Качество без компромиссов</span>
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Преимущества и характеристики ТБ-Ресурс
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[220px]">
          
          {/* Card 1: Anti-slip */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="md:col-span-2 md:row-span-2 bg-white/90 border border-slate-200/80 rounded-3xl p-6 sm:p-10 flex flex-col justify-end relative overflow-hidden group shadow-md"
          >
            <div className="absolute top-6 right-6 w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-200">
              <Footprints className="w-7 sm:w-8 h-7 sm:h-8 text-emerald-600" />
            </div>
            <div className="relative z-10">
              <span className="text-xs font-mono uppercase text-emerald-600 font-bold tracking-wider mb-2 block">Патент завода</span>
              <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Антискольжение</h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-md">
                Уникальный протектор «шип» и «ромб» обеспечивает надежное сцепление копыт даже при обильном скоплении влаги и навоза, полностью предотвращая падения и вывихи у коров.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Made in Tatarstan */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="md:col-span-2 bg-white/90 border border-slate-200/80 rounded-3xl p-8 flex items-center gap-6 shadow-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex-shrink-0 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-headline text-2xl font-bold text-slate-900 mb-1.5">Сделано в Татарстане</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Собственный производственный комплекс в Кукморском районе. 100% контроль качества сырьевого каучука на каждом этапе вулканизации.
              </p>
            </div>
          </motion.div>

          {/* Card 3: 5 years guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-center text-center shadow-md"
          >
            <p className="font-headline text-4xl sm:text-5xl font-bold text-emerald-600 mb-2">5 лет</p>
            <p className="text-xs uppercase font-bold text-slate-600 tracking-wider">Официальная гарантия</p>
          </motion.div>

          {/* Card 4: Fasteners included */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-md"
          >
            <div className="mb-3 w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Wrench className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-900 text-sm mb-1">Крепеж в комплекте</p>
            <p className="text-xs text-slate-600 font-medium">Нержавеющие анкеры и шайбы</p>
          </motion.div>

          {/* Card 5: Damping bottom */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            className="md:col-span-2 bg-white/90 border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group shadow-md"
          >
            <div className="relative z-10">
              <h4 className="font-headline text-2xl font-bold text-slate-900 mb-2">Демпферное дно 8мм</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Нижний рельеф из сотен упругих шипов поглощает ударную нагрузку при вставании тяжелого скота. Мягкость сопоставима с влажной пастбищной почвой.
              </p>
            </div>
          </motion.div>

          {/* Card 6: Custom sizing */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="md:col-span-2 bg-emerald-600 rounded-3xl p-8 flex flex-col justify-center shadow-lg shadow-emerald-500/25"
          >
            <span className="text-[10px] font-mono uppercase text-emerald-100 font-bold tracking-wider mb-1">Раскрой по чертежам</span>
            <h4 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-2">Индивидуальные габариты</h4>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
              Изготовим покрытия точно под нестандартные размеры ваших стойловых секций, навозных каналов и поворотных галерей без обрезков.
            </p>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
};

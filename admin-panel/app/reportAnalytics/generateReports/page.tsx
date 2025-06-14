'use client';

import { useState } from 'react';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import {
  Button
} from '@/components/ui/button';
import {
  Label
} from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/custom/date-range-picker';
import {
  DownloadIcon,
  FilterIcon,
  CalendarIcon,
  LayoutListIcon,
  FileTextIcon,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ReportLineChart from '@/components/custom/ReportLineChart';

const REPORT_TYPES = ['Policies', 'Claims', 'Premiums', 'Users', 'Payouts'];
const EXPORT_FORMATS = ['PDF']; // Only PDF for now
const REGIONS = [
  { label: '🇪🇹 Ethiopia Only', value: 'Ethiopia Only' },
  { label: '🇰🇪 Kenya Border', value: 'Kenya Border' },
  { label: '🇩🇯 Djibouti Border', value: 'Djibouti Border' },
  { label: '🇸🇩 Sudan Border', value: 'Sudan Border' },
  { label: '🇪🇷 Eritrea Border', value: 'Eritrea Border' },
];

const dummyData = [
  { name: 'John Doe', status: 'Active', region: 'Ethiopia Only', vehicle: 'Private' },
  { name: 'Jane Smith', status: 'Expired', region: 'Kenya Border', vehicle: 'Commercial' },
  { name: 'Ali Yassin', status: 'Active', region: 'Djibouti Border', vehicle: 'Public' },
];

export default function GenerateReportsPage() {
  const [reportType, setReportType] = useState<'Policies' | 'Claims' | 'Users'>('Policies');
  const [exportFormat, setExportFormat] = useState('PDF');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>();
  const [filters, setFilters] = useState({
    status: '',
    vehicleType: '',
    region: '',
  });

  const handleGenerate = async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]); // A4 size
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;

    const title = `Report Type: ${reportType}`;
    const date = new Date().toLocaleString();

    page.drawText(title, {
      x: margin,
      y,
      size: 20,
      font,
      color: rgb(0.2, 0.2, 0.7),
    });

    y -= 30;

    page.drawText(`Date Generated: ${date}`, {
      x: margin,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 40;

    dummyData.forEach((entry, i) => {
      const text = `${i + 1}. ${entry.name} - ${entry.status} - ${entry.region} - ${entry.vehicle}`;
      page.drawText(text, {
        x: margin,
        y,
        size: 12,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= 20;
    });

    const pdfBytes = await doc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `${reportType.toLowerCase()}-report.pdf`);

    toast.success('PDF Report has been generated! ✅', {
      icon: <CheckCircle2 className="text-green-500" />,
    });
  };

  const renderDynamicFilters = () => {
    if (reportType !== 'Policies') return null;

    return (
      <>
        <div className="flex items-center gap-2 mt-4 text-muted-foreground text-sm uppercase tracking-wide">
          <FilterIcon className="w-4 h-4" />
          Policy Filters
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Status</Label>
            <Select onValueChange={(val) => setFilters({ ...filters, status: val })}>
              <SelectTrigger className="transition-transform hover:scale-[1.02]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Vehicle Type</Label>
            <Select onValueChange={(val) => setFilters({ ...filters, vehicleType: val })}>
              <SelectTrigger className="transition-transform hover:scale-[1.02]">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Region</Label>
            <Select onValueChange={(val) => setFilters({ ...filters, region: val })}>
              <SelectTrigger className="transition-transform hover:scale-[1.02]">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="p-6 md:p-12 space-y-10 bg-gradient-to-br from-white to-slate-100 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          <LayoutListIcon className="w-6 h-6 text-indigo-500" />
          Generate Reports
        </h1>
        <p className="text-slate-600 text-base">
          Customize filters and download reports with one click.
        </p>
      </div>

      <Card className="rounded-2xl shadow-xl border border-slate-100">
        <CardContent className="p-6 md:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={(value: string) => setReportType(value as 'Policies' | 'Claims' | 'Users')}>
                <SelectTrigger className="hover:scale-[1.02] transition-transform">
                  <SelectValue placeholder="Select Report Type" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="hover:scale-[1.02] transition-transform">
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_FORMATS.map((format) => (
                    <SelectItem key={format} value={format}>{format}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderDynamicFilters()}

          <div className="space-y-2 pt-4">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Date Range
            </Label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>

          <div className="pt-4">
            <Button
              onClick={handleGenerate}
              className="w-full md:w-auto flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              <DownloadIcon className="w-5 h-5" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <ReportLineChart reportType={reportType} />

      <Card className="rounded-2xl shadow-md border border-slate-100">
        <CardContent className="p-6 md:p-8 space-y-3">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-indigo-500" />
            Recent Reports
          </h2>
          <p className="text-slate-500 text-sm">
            No recent reports found. Once generated, your reports will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
